import React from 'react';
import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react';
import { DiagnosticAnswers, SAMPLE_PROFILES } from '../data/seniorJobs';
import { calculateKoreanExactAge } from '../utils/evaluateEligibility';

interface DiagnosticWizardProps {
  answers: DiagnosticAnswers;
  currentStep: number;
  largeText: boolean;
  onToggleLargeText: (large: boolean) => void;
  onChangeAnswers: (updater: (prev: DiagnosticAnswers) => DiagnosticAnswers) => void;
  onStepChange: (step: number) => void;
  onFinish: () => void;
  onApplySample: (answers: DiagnosticAnswers) => void;
  onReset: () => void;
}

const STEP_LABELS = [
  '01. 연령·거주',
  '02. 연금·급여',
  '03. 보험·중복',
  '04. 요양·활동',
  '05. 가점 참고',
];

const REFERENCE_YEAR = 2026;

export const DiagnosticWizard: React.FC<DiagnosticWizardProps> = ({
  answers,
  currentStep,
  largeText,
  onToggleLargeText,
  onChangeAnswers,
  onStepChange,
  onFinish,
  onApplySample,
  onReset,
}) => {
  const exactAge = calculateKoreanExactAge(answers.birthYear, answers.birthdayPassed, REFERENCE_YEAR);

  const birthYears = Array.from({ length: 46 }, (_, i) => 1972 - i); // 1972 down to 1927

  const titleClass = largeText ? 'text-2xl sm:text-[1.65rem] font-bold' : 'text-xl sm:text-2xl font-semibold';
  const bodyClass = largeText ? 'text-base sm:text-lg leading-relaxed' : 'text-sm sm:text-base leading-relaxed';
  const optionTitleClass = largeText ? 'text-base sm:text-lg font-semibold' : 'text-sm sm:text-base font-semibold';
  const optionSubClass = largeText ? 'text-sm sm:text-base' : 'text-xs sm:text-sm';

  return (
    <div className="space-y-5">
      {/* Workspace Toolbar: Sample Profiles & Accessibility Text Size */}
      <div className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-stone-500 mr-1 whitespace-nowrap">예시로 빠르게 체험하기</span>
          {SAMPLE_PROFILES.map((profile) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => onApplySample(profile.answers)}
              className="rounded-md border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:border-emerald-800 hover:bg-emerald-50/60 hover:text-emerald-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {profile.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 rounded-lg bg-stone-100 p-1" role="group" aria-label="글자 크기 설정">
            <button
              type="button"
              onClick={() => onToggleLargeText(false)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                !largeText ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              보통 글씨
            </button>
            <button
              type="button"
              onClick={() => onToggleLargeText(true)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                largeText ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              큰 글씨
            </button>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            초기화
          </button>
        </div>
      </div>

      {/* Diagnostic Card */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-8">
        {/* Step Progress Rail */}
        <div className="mb-8 border-b border-stone-200 pb-5">
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
            {STEP_LABELS.map((label, index) => {
              const isActive = index === currentStep;
              const isPast = index < currentStep;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => onStepChange(index)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-900 text-white'
                      : isPast
                        ? 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                        : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800'
                  }`}
                >
                  {isPast && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 1: Age & Residency */}
        {currentStep === 0 && (
          <div className="space-y-7">
            <div>
              <p className="text-xs font-medium text-emerald-900 mb-1.5">1단계 / 총 5단계</p>
              <h3 className={`${titleClass} text-stone-900`}>출생연도와 국내 거주 여부를 알려주세요</h3>
              <p className={`${bodyClass} mt-1.5 text-stone-600`}>
                노인일자리는 주민등록상 <strong className="font-semibold text-stone-900">만 60세</strong> 또는{' '}
                <strong className="font-semibold text-stone-900">만 65세</strong> 기준으로 신청 가능한 사업이 나뉩니다.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-xl border border-stone-200 bg-[#FAF9F6] p-4 sm:p-5">
                <label htmlFor="birth-year-select" className="block text-sm font-semibold text-stone-900 mb-2">
                  출생연도 선택 ({REFERENCE_YEAR}년 기준 계산)
                </label>
                <div className="flex items-center gap-3">
                  <select
                    id="birth-year-select"
                    value={answers.birthYear}
                    onChange={(e) =>
                      onChangeAnswers((prev) => ({
                        ...prev,
                        birthYear: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-base font-medium text-stone-900 tabular-nums focus:border-emerald-800 focus:outline-none"
                  >
                    {birthYears.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}년생
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onChangeAnswers((prev) => ({ ...prev, birthdayPassed: true }))}
                    className={`rounded-lg border px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      answers.birthdayPassed
                        ? 'border-emerald-800 bg-emerald-50 text-emerald-950'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    올해 생일이 지났음
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeAnswers((prev) => ({ ...prev, birthdayPassed: false }))}
                    className={`rounded-lg border px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      !answers.birthdayPassed
                        ? 'border-emerald-800 bg-emerald-50 text-emerald-950'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    올해 생일 전임
                  </button>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-xl border border-stone-200 bg-[#FAF9F6] p-4 sm:p-5">
                <div>
                  <span className="text-xs font-medium text-stone-500">계산된 신청 기준 나이</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-editorial text-4xl font-bold text-emerald-900 tabular-nums">
                      만 {exactAge}세
                    </span>
                    <span className="text-sm text-stone-600 tabular-nums">
                      ({answers.birthYear}년생 · {answers.birthdayPassed ? '생일 경과' : '생일 전'})
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-xs sm:text-sm text-stone-600">
                  {exactAge >= 65
                    ? '만 65세 이상으로 4가지 모든 노인일자리 유형에 연령 제한 없이 도전할 수 있습니다.'
                    : exactAge >= 60
                      ? '만 60~64세 구간으로 공동체사업단(시장형)과 취업지원(시니어인턴십), 일부 역량활용사업에 참여할 수 있습니다.'
                      : '만 60세 미만은 노인일자리 대상 전 단계로, 만 60세 도래 시점부터 신청 가능합니다.'}
                </p>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-stone-900">현재 대한민국 국내 거주 여부</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    value: 'korean_resident' as const,
                    title: '대한민국 국민 · 국내 거주',
                    desc: '주민등록상 국내 주소지를 두고 실제 거주 중입니다.',
                  },
                  {
                    value: 'foreign_resident' as const,
                    title: '영주권자 · 국내 체류 외국인',
                    desc: '국내 거주 외국인·재외동포(F-5 등)로 체류 자격을 보유했습니다.',
                  },
                  {
                    value: 'non_resident' as const,
                    title: '해외 장기체류 · 미거주',
                    desc: '현재 국내에 주소를 두지 않고 해외에 거주 중입니다.',
                  },
                ].map((opt) => {
                  const selected = answers.residency === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onChangeAnswers((prev) => ({ ...prev, residency: opt.value }))}
                      className={`flex flex-col items-start rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                        selected
                          ? 'border-emerald-800 bg-emerald-50/70'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/60'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className={`${optionTitleClass} text-stone-900`}>{opt.title}</span>
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            selected ? 'border-emerald-800 bg-emerald-800 text-white' : 'border-stone-300 bg-white'
                          }`}
                        >
                          {selected && <Check className="h-3 w-3" aria-hidden="true" />}
                        </span>
                      </div>
                      <span className={`${optionSubClass} mt-1.5 text-stone-600`}>{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Pension & Livelihood Benefits */}
        {currentStep === 1 && (
          <div className="space-y-7">
            <div>
              <p className="text-xs font-medium text-emerald-900 mb-1.5">2단계 / 총 5단계</p>
              <h3 className={`${titleClass} text-stone-900`}>연금 및 기초생활보장 수급 현황을 선택해 주세요</h3>
              <p className={`${bodyClass} mt-1.5 text-stone-600`}>
                <strong className="font-semibold text-stone-900">기초연금 수급 여부</strong>는 공익활동 참여의 핵심 기준이며,{' '}
                <strong className="font-semibold text-stone-900">생계급여</strong>는 공통 참여 제외 기준에 해당합니다.
              </p>
            </div>

            <div>
              <p className="mb-2.5 text-sm font-semibold text-stone-900">1) 현재 기초연금을 받고 계신가요?</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    value: 'receiving' as const,
                    title: '기초연금 수급 중',
                    desc: '매월 25일경 정부에서 지급하는 기초연금을 받고 있습니다.',
                  },
                  {
                    value: 'not_receiving' as const,
                    title: '기초연금 미수급',
                    desc: '소득·재산 기준 초과 또는 연령 미달로 받지 않고 있습니다.',
                  },
                  {
                    value: 'unknown' as const,
                    title: '잘 모르겠음',
                    desc: '국민연금 외 기초연금 수급 여부가 정확히 기억나지 않습니다.',
                  },
                ].map((opt) => {
                  const selected = answers.basicPension === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onChangeAnswers((prev) => ({ ...prev, basicPension: opt.value }))}
                      className={`flex flex-col items-start rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                        selected
                          ? 'border-emerald-800 bg-emerald-50/70'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/60'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className={`${optionTitleClass} text-stone-900`}>{opt.title}</span>
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            selected ? 'border-emerald-800 bg-emerald-800 text-white' : 'border-stone-300 bg-white'
                          }`}
                        >
                          {selected && <Check className="h-3 w-3" aria-hidden="true" />}
                        </span>
                      </div>
                      <span className={`${optionSubClass} mt-1.5 text-stone-600`}>{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2.5 text-sm font-semibold text-stone-900">
                2) 본인 또는 배우자가 직역연금(공무원·사학·군인·별정우체국연금)을 받고 계신가요?
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    value: 'none' as const,
                    title: '해당 없음 (국민연금만 해당 포함)',
                    desc: '본인과 배우자 모두 특수직역연금 수급자가 아닙니다.',
                  },
                  {
                    value: 'receiving' as const,
                    title: '본인 또는 배우자가 직역연금 수급 중',
                    desc: '공무원·사립학교교직원·군인·별정우체국연금을 받고 있습니다.',
                  },
                ].map((opt) => {
                  const selected = answers.occupationalPension === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onChangeAnswers((prev) => ({ ...prev, occupationalPension: opt.value }))}
                      className={`flex flex-col items-start rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                        selected
                          ? 'border-emerald-800 bg-emerald-50/70'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/60'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className={`${optionTitleClass} text-stone-900`}>{opt.title}</span>
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            selected ? 'border-emerald-800 bg-emerald-800 text-white' : 'border-stone-300 bg-white'
                          }`}
                        >
                          {selected && <Check className="h-3 w-3" aria-hidden="true" />}
                        </span>
                      </div>
                      <span className={`${optionSubClass} mt-1.5 text-stone-600`}>{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2.5 text-sm font-semibold text-stone-900">3) 국민기초생활보장 급여를 받고 계신가요?</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    value: 'none' as const,
                    title: '해당 없음',
                    desc: '기초생활보장 수급자가 아닙니다.',
                  },
                  {
                    value: 'livelihood' as const,
                    title: '생계급여 수급자',
                    desc: '생계급여를 수급 중입니다. (의료·주거급여 동시 수급 포함)',
                  },
                  {
                    value: 'other_benefit' as const,
                    title: '의료·주거·교육급여만 수급',
                    desc: '생계급여는 받지 않고 의료·주거·교육급여 중 일부만 받습니다.',
                  },
                ].map((opt) => {
                  const selected = answers.livelihoodBenefit === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onChangeAnswers((prev) => ({ ...prev, livelihoodBenefit: opt.value }))}
                      className={`flex flex-col items-start rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                        selected
                          ? 'border-emerald-800 bg-emerald-50/70'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/60'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className={`${optionTitleClass} text-stone-900`}>{opt.title}</span>
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            selected ? 'border-emerald-800 bg-emerald-800 text-white' : 'border-stone-300 bg-white'
                          }`}
                        >
                          {selected && <Check className="h-3 w-3" aria-hidden="true" />}
                        </span>
                      </div>
                      <span className={`${optionSubClass} mt-1.5 text-stone-600`}>{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Health Insurance & Duplicate Participation */}
        {currentStep === 2 && (
          <div className="space-y-7">
            <div>
              <p className="text-xs font-medium text-emerald-900 mb-1.5">3단계 / 총 5단계</p>
              <h3 className={`${titleClass} text-stone-900`}>건강보험 가입 형태와 다른 일자리 참여 여부를 확인합니다</h3>
              <p className={`${bodyClass} mt-1.5 text-stone-600`}>
                공공 재정지원 노인일자리는 현재 직장에 다니고 있는 <strong className="font-semibold text-stone-900">직장가입자</strong>와
                정부 타 직접일자리 <strong className="font-semibold text-stone-900">중복 참여자</strong>를 제한합니다.
              </p>
            </div>

            <div>
              <p className="mb-2.5 text-sm font-semibold text-stone-900">1) 현재 국민건강보험 가입 자격은 무엇인가요?</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    value: 'local_or_dependent' as const,
                    title: '지역가입자 또는 가족의 피부양자',
                    desc: '현재 근로 중인 직장이 없거나, 자녀·배우자 건강보험에 피부양자로 올라 있습니다.',
                  },
                  {
                    value: 'employee' as const,
                    title: '국민건강보험 직장가입자 (현재 재직 중)',
                    desc: '현재 4대보험이 적용되는 사업장에 근로자로 가입되어 있습니다.',
                  },
                ].map((opt) => {
                  const selected = answers.healthInsurance === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onChangeAnswers((prev) => ({ ...prev, healthInsurance: opt.value }))}
                      className={`flex flex-col items-start rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                        selected
                          ? 'border-emerald-800 bg-emerald-50/70'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/60'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className={`${optionTitleClass} text-stone-900`}>{opt.title}</span>
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            selected ? 'border-emerald-800 bg-emerald-800 text-white' : 'border-stone-300 bg-white'
                          }`}
                        >
                          {selected && <Check className="h-3 w-3" aria-hidden="true" />}
                        </span>
                      </div>
                      <span className={`${optionSubClass} mt-1.5 text-stone-600`}>{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2.5 text-sm font-semibold text-stone-900">
                2) 다른 정부 직접일자리 사업에 참여 중이거나 실업급여를 받고 계신가요?
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    value: 'none' as const,
                    title: '해당 없음 (참여·수급 중 아님)',
                    desc: '다른 지자체 공공근로, 타 노인일자리, 실업급여를 받고 있지 않습니다.',
                  },
                  {
                    value: 'yes' as const,
                    title: '타 직접일자리 참여 중 또는 실업급여 수급 중',
                    desc: '현재 공공근로·지역공동체일자리·타 노인일자리 또는 구직급여를 받고 있습니다.',
                  },
                ].map((opt) => {
                  const selected = answers.duplicateJob === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onChangeAnswers((prev) => ({ ...prev, duplicateJob: opt.value }))}
                      className={`flex flex-col items-start rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                        selected
                          ? 'border-emerald-800 bg-emerald-50/70'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/60'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className={`${optionTitleClass} text-stone-900`}>{opt.title}</span>
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            selected ? 'border-emerald-800 bg-emerald-800 text-white' : 'border-stone-300 bg-white'
                          }`}
                        >
                          {selected && <Check className="h-3 w-3" aria-hidden="true" />}
                        </span>
                      </div>
                      <span className={`${optionSubClass} mt-1.5 text-stone-600`}>{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Long-Term Care & Preferred Intensity */}
        {currentStep === 3 && (
          <div className="space-y-7">
            <div>
              <p className="text-xs font-medium text-emerald-900 mb-1.5">4단계 / 총 5단계</p>
              <h3 className={`${titleClass} text-stone-900`}>노인장기요양등급과 희망 활동 형태를 선택해 주세요</h3>
              <p className={`${bodyClass} mt-1.5 text-stone-600`}>
                장기요양보험 등급 판정 여부는 안전상 참여 제한 기준이며, 희망 활동 시간대에 따라 가장 알맞은 일자리를 우선 추천해 드립니다.
              </p>
            </div>

            <div>
              <p className="mb-2.5 text-sm font-semibold text-stone-900">1) 노인장기요양보험 등급을 판정받으셨나요?</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    value: 'none' as const,
                    title: '등급 없음 (건강하게 활동 가능)',
                    desc: '장기요양 1~5등급 및 인지지원등급 판정을 받지 않았습니다.',
                  },
                  {
                    value: 'graded' as const,
                    title: '장기요양등급 판정자 (1~5등급·인지지원등급)',
                    desc: '국민건강보험공단으로부터 장기요양등급을 판정받아 이용 중입니다.',
                  },
                ].map((opt) => {
                  const selected = answers.longTermCare === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onChangeAnswers((prev) => ({ ...prev, longTermCare: opt.value }))}
                      className={`flex flex-col items-start rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                        selected
                          ? 'border-emerald-800 bg-emerald-50/70'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/60'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className={`${optionTitleClass} text-stone-900`}>{opt.title}</span>
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            selected ? 'border-emerald-800 bg-emerald-800 text-white' : 'border-stone-300 bg-white'
                          }`}
                        >
                          {selected && <Check className="h-3 w-3" aria-hidden="true" />}
                        </span>
                      </div>
                      <span className={`${optionSubClass} mt-1.5 text-stone-600`}>{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2.5 text-sm font-semibold text-stone-900">2) 주로 어떤 강도의 활동을 희망하시나요?</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    value: 'light' as const,
                    title: '가벼운 공익봉사 · 월 30시간',
                    desc: '하루 3시간 이내, 주 2~3회 정도 무리 없이 활동하고 싶습니다.',
                  },
                  {
                    value: 'service' as const,
                    title: '돌봄·안내 · 월 60시간(주 15시간)',
                    desc: '경력을 살려 주 15시간 일하며 월 63~76만원대 급여를 희망합니다.',
                  },
                  {
                    value: 'active' as const,
                    title: '매장·사업단·민간 취업 희망',
                    desc: '실버카페, 공동작업장 또는 일반 민간업체 정식 근로를 원합니다.',
                  },
                ].map((opt) => {
                  const selected = answers.preferredIntensity === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onChangeAnswers((prev) => ({ ...prev, preferredIntensity: opt.value }))}
                      className={`flex flex-col items-start rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                        selected
                          ? 'border-emerald-800 bg-emerald-50/70'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/60'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className={`${optionTitleClass} text-stone-900`}>{opt.title}</span>
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            selected ? 'border-emerald-800 bg-emerald-800 text-white' : 'border-stone-300 bg-white'
                          }`}
                        >
                          {selected && <Check className="h-3 w-3" aria-hidden="true" />}
                        </span>
                      </div>
                      <span className={`${optionSubClass} mt-1.5 text-stone-600`}>{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Priority / Selection Factors */}
        {currentStep === 4 && (
          <div className="space-y-7">
            <div>
              <p className="text-xs font-medium text-emerald-900 mb-1.5">5단계 / 마지막 단계</p>
              <h3 className={`${titleClass} text-stone-900`}>선발 배점 참고를 위한 가구·경력 사항을 알려주세요</h3>
              <p className={`${bodyClass} mt-1.5 text-stone-600`}>
                기본 자격을 충족한 뒤 실제 선발 과정에서는 세대 구성, 경력·자격증, 신규 여부 등이 배점에 반영됩니다.
              </p>
            </div>

            <div>
              <p className="mb-2.5 text-sm font-semibold text-stone-900">1) 현재 세대 구성 형태</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    value: 'alone_or_couple' as const,
                    title: '독거노인 또는 노인부부 세대',
                    desc: '혼자 거주하시거나 노인 부부만 함께 거주하고 계십니다.',
                  },
                  {
                    value: 'with_family' as const,
                    title: '자녀 등 타 세대원과 동거',
                    desc: '자녀, 손자녀 등 다른 가족 구성원과 주민등록상 함께 거주합니다.',
                  },
                ].map((opt) => {
                  const selected = answers.householdType === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onChangeAnswers((prev) => ({ ...prev, householdType: opt.value }))}
                      className={`flex flex-col items-start rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                        selected
                          ? 'border-emerald-800 bg-emerald-50/70'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/60'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className={`${optionTitleClass} text-stone-900`}>{opt.title}</span>
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            selected ? 'border-emerald-800 bg-emerald-800 text-white' : 'border-stone-300 bg-white'
                          }`}
                        >
                          {selected && <Check className="h-3 w-3" aria-hidden="true" />}
                        </span>
                      </div>
                      <span className={`${optionSubClass} mt-1.5 text-stone-600`}>{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="mb-2.5 text-sm font-semibold text-stone-900">2) 관련 자격증 또는 직무 경력 보유 여부</p>
                <div className="grid gap-2.5">
                  {[
                    {
                      value: true,
                      title: '보유 (보육·복지·조리·운전·행정·컴퓨터 등)',
                    },
                    {
                      value: false,
                      title: '별도 자격증·관련 경력 없음',
                    },
                  ].map((opt) => {
                    const selected = answers.hasLicenseOrCareer === opt.value;
                    return (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => onChangeAnswers((prev) => ({ ...prev, hasLicenseOrCareer: opt.value }))}
                        className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors cursor-pointer ${
                          selected
                            ? 'border-emerald-800 bg-emerald-50/70'
                            : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/60'
                        }`}
                      >
                        <span className={`${optionTitleClass} text-stone-900`}>{opt.title}</span>
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            selected ? 'border-emerald-800 bg-emerald-800 text-white' : 'border-stone-300 bg-white'
                          }`}
                        >
                          {selected && <Check className="h-3 w-3" aria-hidden="true" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2.5 text-sm font-semibold text-stone-900">3) 직전 연도 노인일자리 참여 여부</p>
                <div className="grid gap-2.5">
                  {[
                    {
                      value: 'new' as const,
                      title: '신규 신청 (전년도 미참여)',
                    },
                    {
                      value: 'returning' as const,
                      title: '전년도 참여 경력 있음',
                    },
                  ].map((opt) => {
                    const selected = answers.previousParticipant === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChangeAnswers((prev) => ({ ...prev, previousParticipant: opt.value }))}
                        className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors cursor-pointer ${
                          selected
                            ? 'border-emerald-800 bg-emerald-50/70'
                            : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/60'
                        }`}
                      >
                        <span className={`${optionTitleClass} text-stone-900`}>{opt.title}</span>
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            selected ? 'border-emerald-800 bg-emerald-800 text-white' : 'border-stone-300 bg-white'
                          }`}
                        >
                          {selected && <Check className="h-3 w-3" aria-hidden="true" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="mt-8 flex items-center justify-between border-t border-stone-200 pt-5">
          <button
            type="button"
            onClick={() => onStepChange(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className={`inline-flex items-center gap-2 rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
              currentStep === 0
                ? 'cursor-not-allowed bg-stone-50 text-stone-300'
                : 'cursor-pointer bg-white text-stone-700 hover:bg-stone-50 hover:text-stone-900'
            }`}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            이전 단계
          </button>

          <span className="text-xs font-medium text-stone-500 tabular-nums">
            {currentStep + 1} / {STEP_LABELS.length}
          </span>

          {currentStep < STEP_LABELS.length - 1 ? (
            <button
              type="button"
              onClick={() => onStepChange(currentStep + 1)}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              다음 단계
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onFinish}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              진단 결과 보기
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
