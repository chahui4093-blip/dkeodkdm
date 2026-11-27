import React, { useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, CheckCircle2, ClipboardList } from 'lucide-react';
import { DEFAULT_ANSWERS, DiagnosticAnswers } from './data/seniorJobs';
import { evaluateEligibility } from './utils/evaluateEligibility';
import { TopBar } from './components/TopBar';
import { DiagnosticWizard } from './components/DiagnosticWizard';
import { ResultPanel } from './components/ResultPanel';
import { ProgramReferenceSection } from './components/ProgramReferenceSection';
import { DocumentsAndApplySection } from './components/DocumentsAndApplySection';

const HERO_IMAGE_PATH = '/src/assets/images/senior_community_mentoring_1795758157554.jpg';

export function App() {
  const [answers, setAnswers] = useState<DiagnosticAnswers>(DEFAULT_ANSWERS);
  const [baselineAnswers, setBaselineAnswers] = useState<DiagnosticAnswers>(DEFAULT_ANSWERS);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'wizard' | 'result'>('wizard');
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [largeText, setLargeText] = useState<boolean>(false);
  const [heroImgFailed, setHeroImgFailed] = useState<boolean>(false);

  const diagnosticRef = useRef<HTMLElement>(null);

  const result = useMemo(() => evaluateEligibility(answers, 2026), [answers]);

  const scrollToDiagnostic = () => {
    diagnosticRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleStartFromHeader = () => {
    if (hasCompleted && viewMode === 'result') {
      setViewMode('wizard');
      setCurrentStep(0);
    }
    scrollToDiagnostic();
  };

  const handleFinishWizard = () => {
    setBaselineAnswers(answers);
    setHasCompleted(true);
    setViewMode('result');
    scrollToDiagnostic();
  };

  const handleApplySample = (sampleAnswers: DiagnosticAnswers) => {
    setAnswers(sampleAnswers);
    setBaselineAnswers(sampleAnswers);
    setHasCompleted(true);
    setViewMode('result');
  };

  const handleReset = () => {
    setAnswers(DEFAULT_ANSWERS);
    setBaselineAnswers(DEFAULT_ANSWERS);
    setCurrentStep(0);
    setHasCompleted(false);
    setViewMode('wizard');
  };

  const handleEditStep = (stepIndex: number) => {
    setAnswers(baselineAnswers);
    setCurrentStep(stepIndex);
    setViewMode('wizard');
    scrollToDiagnostic();
  };

  return (
    <div id="top" className="min-h-screen bg-[#F8F7F3] text-stone-900">
      <TopBar onStartDiagnostic={handleStartFromHeader} hasCompletedResult={hasCompleted} />

      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero Split Section */}
        <section className="py-10 sm:py-14 no-print">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
            <div className="flex flex-col justify-between lg:col-span-7 py-2">
              <div>
                <p className="text-xs sm:text-sm font-medium text-stone-500">
                  보건복지부 노인일자리 및 사회활동 지원사업 기준 · 자가진단 도우미
                </p>

                <h1 className="font-editorial mt-3 text-3xl sm:text-4xl lg:text-[2.65rem] font-bold leading-[1.24] tracking-tight text-stone-900 text-balance">
                  내가 참여할 수 있는 노인일자리, 1분 만에 확인해 보세요
                </h1>

                <p className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-stone-600">
                  만 나이, 기초연금 수급 여부, 생계급여·건강보험 직장가입·장기요양등급 등 복잡한 참여 조건을 단계별로 점검하여
                  지금 바로 신청 가능한 사업유형을 알려드립니다.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('wizard');
                    scrollToDiagnostic();
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-900 px-6 py-3.5 text-base font-semibold text-white hover:bg-emerald-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  내 참여자격 진단하기
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>

                <a
                  href="#programs"
                  className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-5 py-3.5 text-base font-medium text-stone-800 hover:bg-stone-50 transition-colors whitespace-nowrap shrink-0"
                >
                  4가지 사업유형 보기
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative h-64 sm:h-80 lg:h-full min-h-[280px] overflow-hidden rounded-2xl border border-stone-200 bg-stone-200">
                {!heroImgFailed ? (
                  <img
                    src={HERO_IMAGE_PATH}
                    alt="도서관 테이블에서 함께 책을 정리하며 환하게 웃고 있는 어르신 두 분"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgFailed(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-emerald-950/10 via-stone-100 to-stone-200 p-6 text-center">
                    <ClipboardList className="h-10 w-10 text-emerald-900" aria-hidden="true" />
                    <p className="mt-3 font-editorial text-lg font-bold text-stone-800">노인일자리 참여자격 자가진단</p>
                    <p className="mt-1 text-sm text-stone-600">공익활동 · 역량활용 · 공동체사업단 · 취업지원</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4-Column Quick Overview Strip */}
          <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-stone-200 bg-white p-5 sm:grid-cols-4 sm:p-6">
            <div>
              <p className="text-xs text-stone-500">참여 연령 기준</p>
              <p className="mt-1 text-base sm:text-lg font-bold text-stone-900 tabular-nums">만 60세 · 65세 이상</p>
            </div>
            <div>
              <p className="text-xs text-stone-500">진단 대상 유형</p>
              <p className="mt-1 text-base sm:text-lg font-bold text-stone-900 tabular-nums">4개 공식 사업유형</p>
            </div>
            <div>
              <p className="text-xs text-stone-500">핵심 제한 점검</p>
              <p className="mt-1 text-base sm:text-lg font-bold text-stone-900">생계급여·직장가입·요양등급</p>
            </div>
            <div>
              <p className="text-xs text-stone-500">소요 시간</p>
              <p className="mt-1 text-base sm:text-lg font-bold text-stone-900 tabular-nums">약 1분 (5단계 체크)</p>
            </div>
          </div>
        </section>

        {/* Interactive Diagnostic Workspace */}
        <section id="diagnostic" ref={diagnosticRef} className="scroll-mt-20 border-t border-stone-200 py-12 sm:py-16">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between no-print">
            <div>
              <p className="text-xs font-medium text-stone-500">01. 참여자격 자가진단기</p>
              <h2 className="font-editorial mt-1.5 text-2xl sm:text-3xl font-bold text-stone-900">
                {viewMode === 'wizard' ? '질문에 답하고 참여자격 확인하기' : '참여자격 진단 결과 리포트'}
              </h2>
            </div>

            {hasCompleted && (
              <div className="flex items-center gap-1 rounded-lg bg-stone-200/70 p-1 shrink-0" role="tablist" aria-label="진단 화면 전환">
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === 'wizard'}
                  onClick={() => setViewMode('wizard')}
                  className={`rounded-md px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    viewMode === 'wizard' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  질문 다시 보기
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === 'result'}
                  onClick={() => setViewMode('result')}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    viewMode === 'result' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  진단 결과 보기
                </button>
              </div>
            )}
          </div>

          {viewMode === 'wizard' ? (
            <DiagnosticWizard
              answers={answers}
              currentStep={currentStep}
              largeText={largeText}
              onToggleLargeText={setLargeText}
              onChangeAnswers={setAnswers}
              onStepChange={setCurrentStep}
              onFinish={handleFinishWizard}
              onApplySample={handleApplySample}
              onReset={handleReset}
            />
          ) : (
            <ResultPanel
              answers={answers}
              baselineAnswers={baselineAnswers}
              result={result}
              largeText={largeText}
              onSimulateChange={setAnswers}
              onRestoreBaseline={() => setAnswers(baselineAnswers)}
              onEditStep={handleEditStep}
            />
          )}
        </section>

        {/* Reference Sections */}
        <div className="no-print">
          <ProgramReferenceSection />
          <DocumentsAndApplySection />
        </div>
      </main>

      <footer className="border-t border-stone-200 bg-white py-10 no-print">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="space-y-1">
            <p className="font-editorial text-sm font-bold text-stone-900">시니어 일자리 나침반</p>
            <p className="text-xs leading-relaxed text-stone-500">
              본 진단기는 보건복지부 노인일자리 및 사회활동 지원사업 운영 기준을 바탕으로 만든 사전 자가진단 참고 도구입니다.
              세부 예외 기준과 최종 선발 여부는 거주지 행정복지센터 또는 지역 수행기관(한국노인인력개발원 상담 1544-3388)을 통해 확인해 주세요.
            </p>
          </div>
          <div className="flex items-center gap-5 text-xs font-medium text-stone-600 shrink-0">
            <a href="#diagnostic" className="hover:text-stone-900 hover:underline whitespace-nowrap">
              자격진단
            </a>
            <a href="#programs" className="hover:text-stone-900 hover:underline whitespace-nowrap">
              사업유형
            </a>
            <a href="#documents" className="hover:text-stone-900 hover:underline whitespace-nowrap">
              준비서류
            </a>
            <a href="#apply" className="hover:text-stone-900 hover:underline whitespace-nowrap">
              신청창구
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
