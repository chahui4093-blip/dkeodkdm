export type ProgramId = 'public_interest' | 'capability' | 'community' | 'employment';

export interface ProgramMeta {
  id: ProgramId;
  name: string;
  legacyName: string;
  ageRuleLabel: string;
  incomeRuleLabel: string;
  monthlyPayLabel: string;
  workHoursLabel: string;
  summary: string;
  examples: string[];
  recommendedFor: string;
}

export interface SampleProfile {
  id: string;
  label: string;
  summary: string;
  answers: DiagnosticAnswers;
}

export interface DiagnosticAnswers {
  birthYear: number;
  birthdayPassed: boolean;
  residency: 'korean_resident' | 'foreign_resident' | 'non_resident';
  basicPension: 'receiving' | 'not_receiving' | 'unknown';
  occupationalPension: 'none' | 'receiving';
  livelihoodBenefit: 'none' | 'livelihood' | 'other_benefit';
  healthInsurance: 'local_or_dependent' | 'employee';
  duplicateJob: 'none' | 'yes';
  longTermCare: 'none' | 'graded';
  preferredIntensity: 'light' | 'service' | 'active';
  householdType: 'alone_or_couple' | 'with_family';
  hasLicenseOrCareer: boolean;
  previousParticipant: 'new' | 'returning';
}

export interface DocumentItem {
  id: string;
  title: string;
  detail: string;
  requiredFor: string;
}

export const PROGRAMS: ProgramMeta[] = [
  {
    id: 'public_interest',
    name: '노인공익활동사업',
    legacyName: '구 공익활동형',
    ageRuleLabel: '만 65세 이상',
    incomeRuleLabel: '기초연금 수급자 등',
    monthlyPayLabel: '월 29만원 수준',
    workHoursLabel: '월 30시간 이상 (일 3시간 이내)',
    summary:
      '어르신이 자기만족과 성취감을 높이고 지역사회 공익 증진을 위해 참여하는 대표적인 사회활동입니다.',
    examples: ['노노케어(취약노인 안부확인)', '초등학교 등하교 교통안전 지원', '도서관·공공시설 안내', '동네 환경정화 지킴이'],
    recommendedFor: '기초연금을 수급 중이며 무리 없는 시간대로 지역사회 봉사 성격의 활동을 원하는 분',
  },
  {
    id: 'capability',
    name: '노인역량활용사업',
    legacyName: '구 사회서비스형',
    ageRuleLabel: '만 65세 이상 (일부 60세+)',
    incomeRuleLabel: '기초연금·소득 무관',
    monthlyPayLabel: '월 63.4만 ~ 76.1만원',
    workHoursLabel: '월 60시간 (주 15시간)',
    summary:
      '어르신의 경력과 역량을 활용해 돌봄·안전·행정 등 지역사회에 꼭 필요한 사회서비스를 제공합니다.',
    examples: ['어린이집·아동돌봄 시설 지원', '취약계층 가정·시설 돌봄 보조', '금융·우체국·행정기관 안내', '시니어 디지털·키오스크 안내사'],
    recommendedFor: '기초연금을 받지 않더라도 주 15시간 정도 안정적인 활동과 급여를 희망하는 분',
  },
  {
    id: 'community',
    name: '공동체사업단',
    legacyName: '구 시장형사업단',
    ageRuleLabel: '만 60세 이상',
    incomeRuleLabel: '기초연금·소득 무관',
    monthlyPayLabel: '최저시급 이상 + 수익 배분',
    workHoursLabel: '사업단별 근로계약 상이',
    summary:
      '소규모 매장이나 공동작업장을 운영하며 제조·판매·서비스 수익을 창출하는 사업단 형태 일자리입니다.',
    examples: ['실버카페·베이커리 운영', '반찬·도시락 제조 및 배달', '공동작업장 단순 조립·포장', '아파트 실버택배 및 영농사업'],
    recommendedFor: '만 60세 이상으로 손재주나 협업 능력을 발휘해 실질적인 근로소득을 원하는 분',
  },
  {
    id: 'employment',
    name: '취업지원 (시니어인턴십·취업알선)',
    legacyName: '구 취업알선형',
    ageRuleLabel: '만 60세 이상',
    incomeRuleLabel: '기초연금·소득 무관',
    monthlyPayLabel: '채용 기업 급여 기준 (최저임금 이상)',
    workHoursLabel: '채용 기업 근로계약 기준',
    summary:
      '민간 기업·사업체에 직접 채용되도록 일자리를 연결하거나 인턴십 기간 인건비를 지원합니다.',
    examples: ['아파트 경비·시설·주차 관리', '마트·물류센터 검수 및 진열', '차량 운전·배송 보조', '요양·병원·사무 보조 인력'],
    recommendedFor: '건강과 직무 역량이 충분하며 공공 일자리 외 민간 기업 정식 취업을 원하는 분',
  },
];

export const DEFAULT_ANSWERS: DiagnosticAnswers = {
  birthYear: 1958,
  birthdayPassed: true,
  residency: 'korean_resident',
  basicPension: 'receiving',
  occupationalPension: 'none',
  livelihoodBenefit: 'none',
  healthInsurance: 'local_or_dependent',
  duplicateJob: 'none',
  longTermCare: 'none',
  preferredIntensity: 'light',
  householdType: 'alone_or_couple',
  hasLicenseOrCareer: false,
  previousParticipant: 'new',
};

export const SAMPLE_PROFILES: SampleProfile[] = [
  {
    id: 'senior_68_pension',
    label: '68세 기초연금 수급 어르신',
    summary: '만 68세 · 기초연금 수급 · 무직(피부양자)',
    answers: {
      ...DEFAULT_ANSWERS,
      birthYear: 1958,
      birthdayPassed: true,
      basicPension: 'receiving',
      occupationalPension: 'none',
      livelihoodBenefit: 'none',
      healthInsurance: 'local_or_dependent',
      duplicateJob: 'none',
      longTermCare: 'none',
      preferredIntensity: 'light',
      householdType: 'alone_or_couple',
      hasLicenseOrCareer: false,
      previousParticipant: 'new',
    },
  },
  {
    id: 'retiree_62_active',
    label: '62세 은퇴 후 재취업 희망자',
    summary: '만 62세 · 기초연금 미수급 · 경력 보유',
    answers: {
      ...DEFAULT_ANSWERS,
      birthYear: 1964,
      birthdayPassed: true,
      basicPension: 'not_receiving',
      occupationalPension: 'none',
      livelihoodBenefit: 'none',
      healthInsurance: 'local_or_dependent',
      duplicateJob: 'none',
      longTermCare: 'none',
      preferredIntensity: 'active',
      householdType: 'alone_or_couple',
      hasLicenseOrCareer: true,
      previousParticipant: 'new',
    },
  },
  {
    id: 'senior_71_livelihood',
    label: '71세 생계급여 수급 어르신',
    summary: '만 71세 · 생계급여 수급 · 제한 사유 확인용',
    answers: {
      ...DEFAULT_ANSWERS,
      birthYear: 1955,
      birthdayPassed: true,
      basicPension: 'receiving',
      occupationalPension: 'none',
      livelihoodBenefit: 'livelihood',
      healthInsurance: 'local_or_dependent',
      duplicateJob: 'none',
      longTermCare: 'none',
      preferredIntensity: 'light',
      householdType: 'alone_or_couple',
      hasLicenseOrCareer: false,
      previousParticipant: 'new',
    },
  },
];

export const REQUIRED_DOCUMENTS: DocumentItem[] = [
  {
    id: 'id_card',
    title: '신분증 (주민등록증 또는 운전면허증)',
    detail: '본인 확인을 위해 신청 기관 방문 시 반드시 지참해야 합니다.',
    requiredFor: '모든 사업유형 공통',
  },
  {
    id: 'resident_copy',
    title: '주민등록등본 (최근 3개월 이내 발급)',
    detail: '거주지 확인 및 독거노인·세대주 가점 확인에 활용됩니다. 기관 동의 시 행정정보 공동이용으로 생략 가능할 수 있습니다.',
    requiredFor: '모든 사업유형 공통',
  },
  {
    id: 'pension_proof',
    title: '기초연금 수급자 확인서 또는 입금 통장 사본',
    detail: '노인공익활동사업 신청 시 기초연금 수급 여부를 증빙하기 위해 필요합니다.',
    requiredFor: '노인공익활동사업 필수',
  },
  {
    id: 'health_insurance',
    title: '건강보험 자격득실확인서',
    detail: '현재 직장가입자 해당 여부를 확인하는 서류입니다 (국민건강보험공단 1577-1000 또는 정부24 발급).',
    requiredFor: '공익·역량·공동체 신청 시 확인',
  },
  {
    id: 'career_cert',
    title: '관련 자격증 사본 및 경력증명서 (해당 시)',
    detail: '사회복지·보육·운전·조리·컴퓨터 등 직무와 관련된 자격증이 있으면 선발 배점에 유리합니다.',
    requiredFor: '노인역량활용 · 공동체 · 취업지원',
  },
];
