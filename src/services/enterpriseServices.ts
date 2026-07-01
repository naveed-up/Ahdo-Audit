import {
  Audit,
  AuditTemplate,
  ScoringRule,
  WorkflowStage,
  ActivityLog,
  ApprovalFlow,
  ApprovalStep,
  ApprovalHistory,
  AuditAnswer,
  AuditQuestion
} from '../types';

// ==========================================
// SCORING ENGINE SERVICE
// ==========================================

export function calculateScore(
  audit: Audit,
  template: AuditTemplate,
  rule: ScoringRule
): {
  overallScore: number;
  compliancePercentage: number;
  riskRating: 'Low' | 'Medium' | 'High' | 'Severe';
  sectionScores: { sectionId: string; title: string; score: number }[];
} {
  const answersMap = new Map<string, AuditAnswer>();
  audit.answers.forEach((ans) => {
    answersMap.set(ans.questionId, ans);
  });

  const sectionScores: { sectionId: string; title: string; score: number }[] = [];
  let hasCriticalFailure = false;

  // Pre-calculate section scores
  template.sections.forEach((sec) => {
    let secMaxPoints = 0;
    let secEarnedPoints = 0;

    sec.questions.forEach((q) => {
      const answer = answersMap.get(q.id);
      if (!answer || answer.status === 'N/A' || answer.status === 'Unanswered') {
        return;
      }

      const weight = q.weight || 1;
      secMaxPoints += weight;

      // Earned points
      const isPass = answer.status === 'Pass' || answer.status === 'Conforming' || answer.value.toLowerCase() === 'yes' || answer.value.toLowerCase() === 'pass';
      if (isPass) {
        secEarnedPoints += weight;
      } else {
        // Check if critical checkpoint is failed
        if (q.isCritical) {
          hasCriticalFailure = true;
        }
      }
    });

    const secPercentage = secMaxPoints > 0 ? (secEarnedPoints / secMaxPoints) * 100 : 100;
    sectionScores.push({
      sectionId: sec.id,
      title: sec.title,
      score: Math.round(secPercentage),
    });
  });

  let overallScore = 100;

  if (rule.scoringMethod === 'Percentage') {
    let grandMaxPoints = 0;
    let grandEarnedPoints = 0;

    template.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        const answer = answersMap.get(q.id);
        if (!answer || answer.status === 'N/A' || answer.status === 'Unanswered') {
          return;
        }
        const weight = q.weight || 1;
        grandMaxPoints += weight;

        const isPass = answer.status === 'Pass' || answer.status === 'Conforming' || answer.value.toLowerCase() === 'yes' || answer.value.toLowerCase() === 'pass';
        if (isPass) {
          grandEarnedPoints += weight;
        }
      });
    });

    overallScore = grandMaxPoints > 0 ? (grandEarnedPoints / grandMaxPoints) * 100 : 100;

  } else if (rule.scoringMethod === 'Weighted') {
    // Weighted Sections
    let activeWeightsTotal = 0;
    let weightedSum = 0;

    sectionScores.forEach((secScore) => {
      const secWeightConfig = rule.weightedSections.find(w => w.sectionId === secScore.sectionId);
      const secWeight = secWeightConfig ? secWeightConfig.weight : 0;
      weightedSum += secScore.score * (secWeight / 100);
      activeWeightsTotal += secWeight;
    });

    if (activeWeightsTotal > 0) {
      overallScore = weightedSum;
    } else {
      overallScore = 100;
    }

  } else if (rule.scoringMethod === 'PassFail') {
    // 0 if any failure, else 100
    let hasAnyFail = false;
    template.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        const answer = answersMap.get(q.id);
        if (answer && (answer.status === 'Fail' || answer.status === 'Non-Conforming' || answer.value.toLowerCase() === 'no' || answer.value.toLowerCase() === 'fail')) {
          hasAnyFail = true;
        }
      });
    });
    overallScore = hasAnyFail ? 0 : 100;

  } else if (rule.scoringMethod === 'RiskBased') {
    // Start with 100, deduct points based on failures
    let deduction = 0;
    template.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        const answer = answersMap.get(q.id);
        if (answer && (answer.status === 'Fail' || answer.status === 'Non-Conforming' || answer.value.toLowerCase() === 'no' || answer.value.toLowerCase() === 'fail')) {
          const weight = q.weight || 1;
          deduction += weight * 6;
          if (q.isCritical) {
            deduction += 25;
          }
        }
      });
    });
    overallScore = Math.max(0, 100 - deduction);
  }

  // Handle critical failure override
  if (hasCriticalFailure && rule.criticalFailureEnabled) {
    overallScore = Math.min(overallScore, 40);
  }

  overallScore = Math.max(0, Math.min(100, Math.round(overallScore)));

  // Calculate compliance percentage
  let totalCheckpoints = 0;
  let passedCheckpoints = 0;
  template.sections.forEach((sec) => {
    sec.questions.forEach((q) => {
      const answer = answersMap.get(q.id);
      if (answer && answer.status !== 'Unanswered' && answer.status !== 'N/A') {
        totalCheckpoints++;
        const isPass = answer.status === 'Pass' || answer.status === 'Conforming' || answer.value.toLowerCase() === 'yes' || answer.value.toLowerCase() === 'pass';
        if (isPass) {
          passedCheckpoints++;
        }
      }
    });
  });
  const compliancePercentage = totalCheckpoints > 0 ? Math.round((passedCheckpoints / totalCheckpoints) * 100) : 100;

  // Determine Risk Level based on thresholds
  let riskRating: 'Low' | 'Medium' | 'High' | 'Severe' = 'Low';
  if (overallScore >= rule.complianceThreshold) {
    riskRating = 'Low';
  } else if (overallScore >= 70) {
    riskRating = 'Medium';
  } else if (overallScore >= 50) {
    riskRating = 'High';
  } else {
    riskRating = 'Severe';
  }

  if (hasCriticalFailure && rule.criticalFailureEnabled) {
    riskRating = 'Severe';
  }

  return {
    overallScore,
    compliancePercentage,
    riskRating,
    sectionScores,
  };
}

// ==========================================
// WORKFLOW SERVICE HELPERS
// ==========================================

export const WORKFLOW_STAGES_ORDER: string[] = [
  'Draft',
  'Assigned',
  'In Progress',
  'Submitted',
  'Under Review',
  'Approved',
  'Shared with Client',
  'Closed'
];

export function getNextStage(current: string): string | null {
  const idx = WORKFLOW_STAGES_ORDER.indexOf(current);
  if (idx !== -1 && idx < WORKFLOW_STAGES_ORDER.length - 1) {
    return WORKFLOW_STAGES_ORDER[idx + 1];
  }
  return null;
}

export function getPreviousStage(current: string): string | null {
  const idx = WORKFLOW_STAGES_ORDER.indexOf(current);
  if (idx > 0) {
    return WORKFLOW_STAGES_ORDER[idx - 1];
  }
  return null;
}
