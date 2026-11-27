import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Printer,
  RotateCcw,
  SlidersHorizontal,
  XCircle,
} from 'lucide-react';
import { DiagnosticAnswers } from '../data/seniorJobs';
import { DiagnosticResult, getRecommendedProgramOrder } from '../utils/evaluateEligibility';

interface ResultPanelProps {
  answers: DiagnosticAnswers;
  baselineAnswers: DiagnosticAnswers;
  result: DiagnosticResult;
  largeText: boolean;
  onSimulateChange: (updater: (prev: DiagnosticAnswers) => DiagnosticAnswers) => void;
  onRestoreBaseline: () => void;
  onEditStep: (stepIndex: number) => void;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  answers,
  baselineAnswers,
  result,
  largeText,
  onSimulateChange,
  onRestoreBaseline,
  onEditStep,
}) => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    public_interest: true,
    capability: true,
  });

  const orderedEvaluations = getRecommendedProgramOrder(result.evaluations);
  const isSimulated = JSON.stringify(answers) !== JSON.stringify(baselineAnswers);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const statusTone =
    result.overallStatus === 'available'
      ? {
          icon: <CheckCircle2 className="h-6 w-6 text-emerald-800 shrink-0" aria-hidden="true" />,
          label: '참여 가능 유형 확인',
          surface: 'border-emerald-200 bg-emerald-50/40',
        }
      : result.overallStatus === 'limited'
        ? {
            icon: <AlertTriangle className="h-6 w-6 text-amber-700 shrink-0" aria-hidden="true" />,
            label: '조건 확인 후 연계 가능',
            surface: 'border-amber-200 bg-amber-50/40',
          }
        : {
            icon: <XCircle className="h-6 w-6 text-red-700 shrink-0" aria-hidden="true" />,
            label: '공공형 참여 제한 안내',
            surface: 'border-red-200 bg-red-50/40',
          };

  return (
    <div className="space-y-6">
      {/* Verdict Header Card */}
      <div className={`rounded-2xl border p-6 sm:p-8 print-break-avoid ${statusTone.surface}`}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-stone-800">
              {statusTone.icon}
              <span>{statusTone.label}</span>
              <span aria-hidden="true" className="text-stone-400">
                ·
              </span>
              <span className="text-stone-600 tabular-nums">{result.referenceYear}년 기준 만 {result.age}세</span>
            </div>

            <h3 className={`font-editorial ${largeText ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'} font-bold text-stone-900`}>
              {result.overallTitle}
            </h3>

            <p className={`${largeText ? 'text-base sm:text-lg' : 'text-sm sm:text-base'} max-w-2xl leading-relaxed text-stone-700`}>
              {result.overallSummary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 no-print">
            <button
              type="button"
              onClick={() => onEditStep(0)}
              className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 hover:bg-stone-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              응답 수정하기
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-900 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Printer className="h-4 w-4" aria-hidden="true" />
              결과지 인쇄
            </button>
          </div>
        </div>

        {/* Summary Metrics Strip */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-stone-200/80 pt-5 sm:grid-cols-4">
          <div>
            <p className="text-xs text-stone-500">기준 만 나이</p>
            <p className="mt-1 text-lg font-semibold text-stone-900 tabular-nums">만 {result.age}세</p>
          </div>
          <div>
            <p className="text-xs text-stone-500">즉시 지원 가능</p>
            <p className="mt-1 text-lg font-semibold text-emerald-900 tabular-nums">{result.eligibleCount}개 유형</p>
          </div>
          <div>
            <p className="text-xs text-stone-500">추가 확인 필요</p>
            <p className="mt-1 text-lg font-semibold text-amber-800 tabular-nums">{result.checkNeededCount}개 유형</p>
          </div>
          <div>
            <p className="text-xs text-stone-500">기초연금·생계급여 상태</p>
            <p className="mt-1 text-sm font-semibold text-stone-800">
              {answers.livelihoodBenefit === 'livelihood'
                ? '생계급여 수급'
                : answers.basicPension === 'receiving'
                  ? '기초연금 수급'
                  : answers.basicPension === 'unknown'
                    ? '기초연금 확인 필요'
                    : '기초연금 미수급'}
            </p>
          </div>
        </div>
      </div>

      {/* Live Scenario Simulator */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 no-print">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-stone-900">
            <SlidersHorizontal className="h-4 w-4 text-emerald-800 shrink-0" aria-hidden="true" />
            <span>조건이 바뀌면 결과가 어떻게 달라질까요? (실시간 모의 실험)</span>
          </div>
          {isSimulated && (
            <button
              type="button"
              onClick={onRestoreBaseline}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-900 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              처음 진단 조건으로 되돌리기
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              onSimulateChange((prev) => ({
                ...prev,
                basicPension: prev.basicPension === 'receiving' ? 'not_receiving' : 'receiving',
              }))
            }
            className={`rounded-lg border px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              answers.basicPension === 'receiving'
                ? 'border-emerald-800 bg-emerald-50 text-emerald-950'
                : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
            }`}
          >
            기초연금 수급: {answers.basicPension === 'receiving' ? '수급 중' : '미수급'}
          </button>

          <button
            type="button"
            onClick={() =>
              onSimulateChange((prev) => ({
                ...prev,
                healthInsurance: prev.healthInsurance === 'employee' ? 'local_or_dependent' : 'employee',
              }))
            }
            className={`rounded-lg border px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              answers.healthInsurance === 'local_or_dependent'
                ? 'border-emerald-800 bg-emerald-50 text-emerald-950'
                : 'border-amber-300 bg-amber-50 text-amber-900'
            }`}
          >
            건강보험: {answers.healthInsurance === 'employee' ? '직장가입자(근로 중)' : '지역·피부양자'}
          </button>

          <button
            type="button"
            onClick={() =>
              onSimulateChange((prev) => ({
                ...prev,
                livelihoodBenefit: prev.livelihoodBenefit === 'livelihood' ? 'none' : 'livelihood',
              }))
            }
            className={`rounded-lg border px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              answers.livelihoodBenefit !== 'livelihood'
                ? 'border-emerald-800 bg-emerald-50 text-emerald-950'
                : 'border-red-300 bg-red-50 text-red-900'
            }`}
          >
            생계급여: {answers.livelihoodBenefit === 'livelihood' ? '수급 중' : '미수급'}
          </button>

          <button
            type="button"
            onClick={() =>
              onSimulateChange((prev) => ({
                ...prev,
                birthYear: prev.birthYear > 1961 ? 1961 : baselineAnswers.birthYear,
                birthdayPassed: true,
              }))
            }
            className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-xs sm:text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {result.age < 65 ? '만 65세(1961년생) 도달 시 미리보기' : '현재 나이 기준 유지'}
          </button>
        </div>
      </div>

      {/* 4 Program Evaluation Cards */}
      <div className="space-y-4">
        {orderedEvaluations.map((ev) => {
          const isExpanded = !!expandedIds[ev.program.id];
          const badge =
            ev.status === 'eligible'
              ? {
                  icon: <CheckCircle2 className="h-4 w-4 text-emerald-800 shrink-0" aria-hidden="true" />,
                  textClass: 'text-emerald-900',
                  borderClass: 'border-stone-200 bg-white',
                }
              : ev.status === 'check_needed'
                ? {
                    icon: <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0" aria-hidden="true" />,
                    textClass: 'text-amber-800',
                    borderClass: 'border-stone-200 bg-white',
                  }
                : {
                    icon: <XCircle className="h-4 w-4 text-red-700 shrink-0" aria-hidden="true" />,
                    textClass: 'text-red-800',
                    borderClass: 'border-stone-200 bg-stone-50/70',
                  };

          return (
            <article
              key={ev.program.id}
              className={`rounded-2xl border p-5 sm:p-6 transition-colors print-break-avoid ${badge.borderClass}`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <span className={`inline-flex items-center gap-1.5 text-sm font-bold ${badge.textClass}`}>
                      {badge.icon}
                      {ev.statusLabel}
                    </span>
                    <span aria-hidden="true" className="text-stone-300">
                      ·
                    </span>
                    <span className="text-xs sm:text-sm text-stone-500">
                      {ev.program.ageRuleLabel} · {ev.program.incomeRuleLabel}
                    </span>
                    {ev.recommendedMatch && (
                      <>
                        <span aria-hidden="true" className="text-stone-300">
                          ·
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-emerald-900">
                          희망 활동 강도와 가장 잘 맞음
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap items-baseline gap-2">
                    <h4 className={`font-editorial ${largeText ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'} font-bold text-stone-900`}>
                      {ev.program.name}
                    </h4>
                    <span className="text-xs sm:text-sm text-stone-500">({ev.program.legacyName})</span>
                  </div>

                  <p className={`${largeText ? 'text-base' : 'text-sm'} text-stone-700 leading-relaxed`}>
                    {ev.headlineReason}
                  </p>
                </div>

                <div className="flex flex-row sm:flex-col items-baseline sm:items-end justify-between gap-2 border-t border-stone-100 pt-3 sm:border-t-0 sm:pt-0 shrink-0">
                  <div className="sm:text-right">
                    <p className="text-xs text-stone-500">예상 활동비·급여</p>
                    <p className="text-base font-bold text-stone-900 tabular-nums">{ev.program.monthlyPayLabel}</p>
                    <p className="text-xs text-stone-600 tabular-nums mt-0.5">{ev.program.workHoursLabel}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4">
                <p className="text-xs sm:text-sm text-stone-600">
                  <span className="font-medium text-stone-800">주요 직무: </span>
                  {ev.program.examples.join(' · ')}
                </p>

                <button
                  type="button"
                  onClick={() => toggleExpand(ev.program.id)}
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-emerald-900 hover:underline whitespace-nowrap shrink-0 cursor-pointer no-print"
                >
                  {isExpanded ? '세부 점검 접기' : '세부 기준 점검 보기'}
                  {isExpanded ? <ChevronUp className="h-4 w-4" aria-hidden="true" /> : <ChevronDown className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>

              {isExpanded && (
                <div className="mt-4 border-t border-stone-200 pt-4">
                  <dl className="grid gap-3 sm:grid-cols-2">
                    {ev.checks.map((check) => (
                      <div key={check.label} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        {check.passed === 'pass' ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800" aria-hidden="true" />
                        ) : check.passed === 'warn' ? (
                          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
                        ) : (
                          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" aria-hidden="true" />
                        )}
                        <div>
                          <dt className="font-semibold text-stone-900">{check.label}</dt>
                          <dd className="mt-0.5 text-stone-600 leading-relaxed">{check.detail}</dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Priority Notes & Next Step Guidance */}
      <div className="grid gap-5 sm:grid-cols-2 print-break-avoid">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
          <h4 className="font-editorial text-lg font-bold text-stone-900">선발 배점·가점 참고 사항</h4>
          <ul className="mt-3 space-y-2.5 text-sm text-stone-700 leading-relaxed">
            {result.priorityNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-tabular text-xs font-semibold text-emerald-900 mt-1">0{idx + 1}.</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
          <h4 className="font-editorial text-lg font-bold text-stone-900">다음 행동 안내</h4>
          <ul className="mt-3 space-y-2.5 text-sm text-stone-700 leading-relaxed">
            {result.actionTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-tabular text-xs font-semibold text-emerald-900 mt-1">0{idx + 1}.</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
