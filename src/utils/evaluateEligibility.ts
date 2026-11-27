import { DiagnosticAnswers, PROGRAMS, ProgramId, ProgramMeta } from '../data/seniorJobs';

export type EligibilityStatus = 'eligible' | 'check_needed' | 'ineligible';

export interface CriterionCheck {
  label: string;
  passed: 'pass' | 'warn' | 'fail';
  detail: string;
}

export interface ProgramEvaluation {
  program: ProgramMeta;
  status: EligibilityStatus;
  statusLabel: string;
  headlineReason: string;
  recommendedMatch: boolean;
  checks: CriterionCheck[];
}

export interface DiagnosticResult {
  age: number;
  referenceYear: number;
  overallStatus: 'available' | 'limited' | 'restricted';
  overallTitle: string;
  overallSummary: string;
  eligibleCount: number;
  checkNeededCount: number;
  evaluations: ProgramEvaluation[];
  priorityNotes: string[];
  actionTips: string[];
}

export function calculateKoreanExactAge(birthYear: number, birthdayPassed: boolean, referenceYear = 2026): number {
  const rawDiff = referenceYear - birthYear;
  return birthdayPassed ? rawDiff : rawDiff - 1;
}

export function evaluateEligibility(answers: DiagnosticAnswers, referenceYear = 2026): DiagnosticResult {
  const age = calculateKoreanExactAge(answers.birthYear, answers.birthdayPassed, referenceYear);

  const evaluations: ProgramEvaluation[] = PROGRAMS.map((program) => {
    const checks: CriterionCheck[] = [];

    // 1. 국내 거주 체크
    if (answers.residency === 'non_resident') {
      checks.push({
        label: '거주 요건',
        passed: 'fail',
        detail: '해외 장기체류 중이거나 국내 거주지가 없으면 참여가 제한됩니다.',
      });
    } else if (answers.residency === 'foreign_resident') {
      checks.push({
        label: '거주 요건',
        passed: 'warn',
        detail: '외국인등록·영주권(F-5) 등 합법적 국내 체류 및 기초연금·지자체 지침 충족 여부를 주민센터에서 확인해야 합니다.',
      });
    } else {
      checks.push({
        label: '거주 요건',
        passed: 'pass',
        detail: '대한민국 국민으로서 국내에 거주하고 있어 기본 거주 요건을 충족합니다.',
      });
    }

    // 2. 연령 요건
    if (program.id === 'public_interest') {
      if (age >= 65) {
        checks.push({
          label: '연령 기준 (만 65세+)',
          passed: 'pass',
          detail: `현재 만 ${age}세로 공익활동 참여 연령 기준을 충족합니다.`,
        });
      } else {
        checks.push({
          label: '연령 기준 (만 65세+)',
          passed: 'fail',
          detail: `현재 만 ${age}세로 만 65세 미만입니다. 만 65세 생일이 지난 뒤 신청할 수 있습니다.`,
        });
      }
    } else if (program.id === 'capability') {
      if (age >= 65) {
        checks.push({
          label: '연령 기준 (만 65세+)',
          passed: 'pass',
          detail: `현재 만 ${age}세로 역량활용사업 기본 연령 기준을 충족합니다.`,
        });
      } else if (age >= 60) {
        checks.push({
          label: '연령 기준 (일부 만 60세+)',
          passed: 'warn',
          detail: `현재 만 ${age}세입니다. 기본 기준은 만 65세 이상이나, 일부 돌봄·안전 특화 사업단은 만 60세 이상 선발을 허용하므로 지역 수행기관 모집공고 확인이 필요합니다.`,
        });
      } else {
        checks.push({
          label: '연령 기준 (만 65세+)',
          passed: 'fail',
          detail: `현재 만 ${age}세로 참여 최소 연령(만 60세)에 도달하지 않았습니다.`,
        });
      }
    } else {
      // community & employment: 만 60세 이상
      if (age >= 60) {
        checks.push({
          label: '연령 기준 (만 60세+)',
          passed: 'pass',
          detail: `현재 만 ${age}세로 만 60세 이상 참여 요건을 충족합니다.`,
        });
      } else {
        checks.push({
          label: '연령 기준 (만 60세+)',
          passed: 'fail',
          detail: `현재 만 ${age}세로 만 60세 이상부터 참여 가능합니다.`,
        });
      }
    }

    // 3. 연금/소득 요건 (공익활동 전용 vs 나머지)
    if (program.id === 'public_interest') {
      if (answers.basicPension === 'receiving' && answers.occupationalPension === 'none') {
        checks.push({
          label: '기초연금·소득 기준',
          passed: 'pass',
          detail: '기초연금 수급자에 해당하여 노인공익활동사업 핵심 자격 요건을 충족합니다.',
        });
      } else if (answers.occupationalPension === 'receiving') {
        checks.push({
          label: '기초연금·소득 기준',
          passed: 'warn',
          detail:
            '공무원·사학·군인·별정우체국 등 직역연금 수급자(배우자 포함)는 원칙적으로 기초연금 대상에서 제외되나, 보건복지부 장관이 정한 일정 소득 이하 기준 충족 시 예외 참여 가능 여부를 확인해야 합니다.',
        });
      } else if (answers.basicPension === 'unknown') {
        checks.push({
          label: '기초연금·소득 기준',
          passed: 'warn',
          detail: '노인공익활동사업은 기초연금 수급 여부가 필수입니다. 복지로 또는 주민센터에서 수급 여부를 먼저 확인하세요.',
        });
      } else {
        checks.push({
          label: '기초연금·소득 기준',
          passed: 'fail',
          detail: '기초연금 미수급자는 공익활동 참여가 어렵습니다. 소득 무관 유형(역량활용·공동체·취업지원)을 권장합니다.',
        });
      }
    } else {
      checks.push({
        label: '연금·소득 기준',
        passed: 'pass',
        detail: '기초연금 수급 여부나 소득 수준과 무관하게 지원할 수 있습니다.',
      });
    }

    // 4. 생계급여 수급 여부
    if (answers.livelihoodBenefit === 'livelihood') {
      if (program.id === 'employment') {
        checks.push({
          label: '생계급여 수급 제한',
          passed: 'warn',
          detail:
            '민간 취업알선·시니어인턴십은 참여 가능하지만, 근로소득 발생 시 생계급여 감액 또는 탈수급이 될 수 있어 담당 사회복지사와 상담 후 결정하는 것이 안전합니다.',
        });
      } else {
        checks.push({
          label: '생계급여 수급 제한',
          passed: 'fail',
          detail:
            '국민기초생활보장 생계급여 수급자는 공공 재정지원 노인일자리(공익·역량·공동체) 참여 제외 대상입니다. (의료·주거·교육급여만 받는 경우는 참여 가능)',
        });
      }
    } else if (answers.livelihoodBenefit === 'other_benefit') {
      checks.push({
        label: '기초생활보장 급여',
        passed: 'pass',
        detail: '의료·주거·교육급여 수급자는 노인일자리 참여가 가능하며, 선발 시 우선배점 대상이 될 수 있습니다.',
      });
    } else {
      checks.push({
        label: '생계급여 제외 해당 없음',
        passed: 'pass',
        detail: '생계급여 수급자에 해당하지 않아 제한 사유가 없습니다.',
      });
    }

    // 5. 건강보험 직장가입자 여부
    if (answers.healthInsurance === 'employee') {
      if (program.id === 'public_interest' || program.id === 'capability') {
        checks.push({
          label: '건강보험 직장가입자 제한',
          passed: 'fail',
          detail: '국민건강보험 직장가입자는 공익활동·역량활용사업 참여 제외 대상입니다. 퇴직·자격 상실 후 신청 가능합니다.',
        });
      } else if (program.id === 'community') {
        checks.push({
          label: '건강보험 직장가입자 확인',
          passed: 'warn',
          detail: '타 직장에 직장가입자로 재직 중이면 공동체사업단 참여가 제한될 수 있습니다. 사업단 계약 전 퇴직 예정 여부를 확인하세요.',
        });
      } else {
        checks.push({
          label: '건강보험 직장가입자 기준',
          passed: 'pass',
          detail: '취업지원(민간 취업알선)은 직장가입 여부와 관계없이 구직 및 이직 상담이 가능합니다.',
        });
      }
    } else {
      checks.push({
        label: '건강보험 자격',
        passed: 'pass',
        detail: '지역가입자 또는 피부양자로 직장가입자 제외 규정에 걸리지 않습니다.',
      });
    }

    // 6. 장기요양보험 등급 판정자
    if (answers.longTermCare === 'graded') {
      if (program.id === 'employment') {
        checks.push({
          label: '장기요양등급 확인',
          passed: 'warn',
          detail: '장기요양 등급 판정자는 직무 안전 및 수행 가능 여부를 채용 기업·수행기관과 사전 상담해야 합니다.',
        });
      } else {
        checks.push({
          label: '장기요양등급 제한',
          passed: 'fail',
          detail: '노인장기요양보험 1~5등급 또는 인지지원등급 판정자는 원칙적으로 참여 제한 대상입니다. (단, 활동 가능 여부에 대한 지자체 예외 심의는 별도 문의 필요)',
        });
      }
    } else {
      checks.push({
        label: '장기요양등급 제한 없음',
        passed: 'pass',
        detail: '장기요양등급 판정자가 아니므로 건강상 결격 사유가 없습니다.',
      });
    }

    // 7. 타 일자리 중복 참여 / 실업급여
    if (answers.duplicateJob === 'yes') {
      if (program.id === 'employment') {
        checks.push({
          label: '중복참여·실업급여 확인',
          passed: 'warn',
          detail: '민간 취업알선은 가능하나, 실업급여 수급 중 취업 시 구직급여 지급이 중단되므로 고용센터 확인이 필요합니다.',
        });
      } else {
        checks.push({
          label: '정부 일자리 중복 제한',
          passed: 'fail',
          detail: '정부·지자체 직접일자리 2개 이상 중복 참여 및 실업급여 수급 중 참여는 불가합니다. 기존 사업 종료 후 신청하세요.',
        });
      }
    } else {
      checks.push({
        label: '중복참여 제한 없음',
        passed: 'pass',
        detail: '다른 직접일자리나 실업급여 수급과 겹치지 않습니다.',
      });
    }

    // Determine aggregate status for this program
    const hasFail = checks.some((c) => c.passed === 'fail');
    const hasWarn = checks.some((c) => c.passed === 'warn');

    let status: EligibilityStatus = 'eligible';
    let statusLabel = '지원 가능';
    if (hasFail) {
      status = 'ineligible';
      statusLabel = '지원 제한';
    } else if (hasWarn) {
      status = 'check_needed';
      statusLabel = '추가 확인 필요';
    }

    const firstIssue = checks.find((c) => c.passed === 'fail') ?? checks.find((c) => c.passed === 'warn');
    const headlineReason = firstIssue
      ? firstIssue.detail
      : `모든 자격 요건(만 ${age}세 · 소득 · 결격사유 없음)을 충족하여 바로 신청할 수 있습니다.`;

    const recommendedMatch =
      status === 'eligible' &&
      ((answers.preferredIntensity === 'light' && program.id === 'public_interest') ||
        (answers.preferredIntensity === 'service' && program.id === 'capability') ||
        (answers.preferredIntensity === 'active' && (program.id === 'community' || program.id === 'employment')));

    return {
      program,
      status,
      statusLabel,
      headlineReason,
      recommendedMatch,
      checks,
    };
  });

  const eligibleCount = evaluations.filter((e) => e.status === 'eligible').length;
  const checkNeededCount = evaluations.filter((e) => e.status === 'check_needed').length;

  let overallStatus: DiagnosticResult['overallStatus'] = 'available';
  let overallTitle = '';
  let overallSummary = '';

  if (eligibleCount > 0) {
    overallStatus = 'available';
    overallTitle = `바로 지원 가능한 일자리 유형 ${eligibleCount}개를 찾았습니다`;
    overallSummary = `만 ${age}세 기준으로 기본 자격과 제외 사유를 점검한 결과, 즉시 신청할 수 있는 사업유형이 확인되었습니다.`;
  } else if (checkNeededCount > 0) {
    overallStatus = 'limited';
    overallTitle = '일부 조건 확인 후 참여 가능한 유형이 있습니다';
    overallSummary = `현재 조건상 바로 지원 가능한 공공형 일자리는 없으나, ${checkNeededCount}개 유형은 세부 확인 후 연계 가능합니다.`;
  } else {
    overallStatus = 'restricted';
    overallTitle = '현재 기준에서는 참여 제한 사유가 확인되었습니다';
    overallSummary = '연령 미달 또는 공통 제외 기준(생계급여·직장가입·장기요양등급 등)에 해당하여 제한 사유 해소가 먼저 필요합니다.';
  }

  // Priority & scoring notes
  const priorityNotes: string[] = [];
  if (answers.householdType === 'alone_or_couple') {
    priorityNotes.push('독거노인 또는 노인부부 세대는 지자체 선발기준표에서 가점(세대구성 배점)을 받을 수 있습니다.');
  }
  if (answers.livelihoodBenefit === 'other_benefit') {
    priorityNotes.push('의료·주거·교육급여 수급자는 생계급여와 달리 참여가 가능하며 소득 영역에서 높은 배점을 받습니다.');
  }
  if (answers.hasLicenseOrCareer) {
    priorityNotes.push('관련 자격증이나 경력은 노인역량활용사업(사회서비스형)과 공동체사업단 선발 시 중요한 가산 요인입니다.');
  }
  if (answers.previousParticipant === 'new') {
    priorityNotes.push('신규 신청자는 일부 지자체·수행기관의 신규 참여자 우선 선발 기준에 유리하게 적용될 수 있습니다.');
  } else {
    priorityNotes.push('전년도 참여자는 사업 연속성 평가 또는 신규자 우선 원칙에 따라 기관별 배점 기준이 다를 수 있습니다.');
  }

  const actionTips: string[] = [];
  if (age < 60) {
    actionTips.push('만 60세 미만은 보건복지부 노인일자리 대상이 아니므로 고용24(국민취업지원제도)나 지자체 중장년 일자리 센터를 이용하세요.');
  } else if (age >= 60 && age < 65) {
    actionTips.push('만 60~64세 구간에서는 공동체사업단(구 시장형)과 시니어인턴십·취업지원이 가장 폭넓게 열려 있습니다.');
  }
  if (answers.livelihoodBenefit === 'livelihood') {
    actionTips.push('생계급여 수급 중에는 자활근로(지역자활센터) 또는 민간 취업 시 급여 변동 상담을 먼저 받아보시는 것을 권합니다.');
  }
  if (answers.basicPension === 'unknown') {
    actionTips.push('기초연금 수급 여부를 모른다면 복지로(bokjiro.go.kr) 또는 거주지 주민센터에서 확인한 뒤 공익활동 신청 여부를 결정하세요.');
  }
  actionTips.push('정기 모집은 보통 매년 11~12월에 집중되지만, 중도 포기자 발생 시 연중 수시 모집도 진행되니 지역 시니어클럽에 대기 등록을 문의하세요.');

  return {
    age,
    referenceYear,
    overallStatus,
    overallTitle,
    overallSummary,
    eligibleCount,
    checkNeededCount,
    evaluations,
    priorityNotes,
    actionTips,
  };
}

export function getRecommendedProgramOrder(evaluations: ProgramEvaluation[]): ProgramEvaluation[] {
  const rank = { eligible: 0, check_needed: 1, ineligible: 2 };
  return [...evaluations].sort((a, b) => {
    if (a.recommendedMatch !== b.recommendedMatch) return a.recommendedMatch ? -1 : 1;
    return rank[a.status] - rank[b.status];
  });
}

export const ELIGIBLE_LABEL: Record<ProgramId, string> = {
  public_interest: '노인공익활동사업',
  capability: '노인역량활용사업',
  community: '공동체사업단',
  employment: '취업지원',
};
