import React, { useState } from 'react';
import { PROGRAMS, ProgramMeta } from '../data/seniorJobs';

type ProgramFilter = 'all' | 'age60' | 'age65' | 'no_income_limit';

export const ProgramReferenceSection: React.FC = () => {
  const [filter, setFilter] = useState<ProgramFilter>('all');

  const filteredPrograms: ProgramMeta[] = PROGRAMS.filter((p) => {
    if (filter === 'age60') return p.id === 'community' || p.id === 'employment' || p.id === 'capability';
    if (filter === 'age65') return p.id === 'public_interest' || p.id === 'capability';
    if (filter === 'no_income_limit') return p.id !== 'public_interest';
    return true;
  });

  return (
    <section id="programs" className="scroll-mt-20 border-t border-stone-200 py-14 sm:py-16">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium text-stone-500">02. 노인일자리 및 사회활동 지원사업</p>
          <h2 className="font-editorial mt-1.5 text-2xl sm:text-3xl font-bold text-stone-900">
            4가지 사업유형 한눈에 비교하기
          </h2>
          <p className="mt-2 max-w-2xl text-sm sm:text-base text-stone-600 leading-relaxed">
            연령과 기초연금 수급 여부, 원하시는 근무 시간에 따라 지원할 수 있는 사업유형이 달라집니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 rounded-lg bg-stone-200/70 p-1 shrink-0" role="tablist" aria-label="사업유형 필터">
          {[
            { id: 'all' as const, label: '전체 보기' },
            { id: 'age60' as const, label: '만 60세+ 가능' },
            { id: 'age65' as const, label: '만 65세+ 주력' },
            { id: 'no_income_limit' as const, label: '소득 무관' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filter === tab.id}
              onClick={() => setFilter(tab.id)}
              className={`rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filter === tab.id ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {filteredPrograms.map((program, idx) => (
          <div key={program.id} className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-6">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs text-stone-500">
                <span>
                  0{idx + 1}. {program.legacyName}
                </span>
                <span>
                  {program.ageRuleLabel} · {program.incomeRuleLabel}
                </span>
              </div>

              <h3 className="font-editorial mt-2 text-xl font-bold text-stone-900">{program.name}</h3>
              <p className="mt-2 text-sm text-stone-600 leading-relaxed">{program.summary}</p>

              <dl className="mt-5 grid grid-cols-2 gap-4 border-y border-stone-100 py-4 text-sm">
                <div>
                  <dt className="text-xs text-stone-500">예상 활동비·급여</dt>
                  <dd className="mt-0.5 font-semibold text-stone-900 tabular-nums">{program.monthlyPayLabel}</dd>
                </div>
                <div>
                  <dt className="text-xs text-stone-500">활동 시간</dt>
                  <dd className="mt-0.5 font-semibold text-stone-900 tabular-nums">{program.workHoursLabel}</dd>
                </div>
              </dl>

              <div className="mt-4">
                <p className="text-xs font-semibold text-stone-700">주요 활동 분야</p>
                <p className="mt-1 text-sm text-stone-600 leading-relaxed">{program.examples.join(' · ')}</p>
              </div>
            </div>

            <div className="mt-5 border-t border-stone-100 pt-3.5 text-xs sm:text-sm text-emerald-950">
              <span className="font-semibold">추천 대상: </span>
              <span className="text-stone-700">{program.recommendedFor}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
