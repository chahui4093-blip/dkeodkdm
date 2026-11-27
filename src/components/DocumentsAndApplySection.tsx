import React, { useState } from 'react';
import { Check, Phone, Globe, Building2, Calendar } from 'lucide-react';
import { REQUIRED_DOCUMENTS } from '../data/seniorJobs';

export const DocumentsAndApplySection: React.FC = () => {
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const toggleDoc = (id: string) => {
    setCheckedDocs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checkedCount = Object.values(checkedDocs).filter(Boolean).length;

  return (
    <div className="space-y-0">
      {/* Section 03: Required Documents Checklist */}
      <section id="documents" className="scroll-mt-20 border-t border-stone-200 py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <p className="text-xs font-medium text-stone-500">03. 방문·온라인 신청 준비물</p>
            <h2 className="font-editorial mt-1.5 text-2xl sm:text-3xl font-bold text-stone-900">
              미리 챙기면 좋은 구비서류
            </h2>
            <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed">
              복지관이나 주민센터에 직접 방문하기 전에 아래 서류를 확인하고 체크해 보세요. 지자체와 수행기관에 따라 일부 서류는
              현장 신청서 작성 시 행정정보 공동이용 동의로 대체될 수 있습니다.
            </p>
            <div className="mt-5 rounded-xl border border-stone-200 bg-white px-4 py-3.5 text-sm text-stone-700">
              현재 준비 체크 현황:{' '}
              <strong className="font-semibold text-emerald-900 tabular-nums">
                {checkedCount} / {REQUIRED_DOCUMENTS.length}개 확인됨
              </strong>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-3">
            {REQUIRED_DOCUMENTS.map((doc) => {
              const checked = !!checkedDocs[doc.id];
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => toggleDoc(doc.id)}
                  className={`flex w-full items-start gap-4 rounded-xl border p-4 sm:p-5 text-left transition-colors cursor-pointer ${
                    checked
                      ? 'border-emerald-800 bg-emerald-50/50'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                      checked
                        ? 'border-emerald-800 bg-emerald-800 text-white'
                        : 'border-stone-300 bg-white'
                    }`}
                    aria-hidden="true"
                  >
                    {checked && <Check className="h-3.5 w-3.5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className={`text-sm sm:text-base font-semibold ${checked ? 'text-emerald-950' : 'text-stone-900'}`}>
                        {doc.title}
                      </span>
                      <span className="text-xs text-stone-500">{doc.requiredFor}</span>
                    </div>
                    <p className="mt-1 text-xs sm:text-sm text-stone-600 leading-relaxed">{doc.detail}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 04: How & Where to Apply */}
      <section id="apply" className="scroll-mt-20 border-t border-stone-200 py-14 sm:py-16">
        <div>
          <p className="text-xs font-medium text-stone-500">04. 신청 절차 및 공식 창구</p>
          <h2 className="font-editorial mt-1.5 text-2xl sm:text-3xl font-bold text-stone-900">
            어디서, 언제 신청할 수 있나요?
          </h2>
          <p className="mt-2 max-w-2xl text-sm sm:text-base text-stone-600 leading-relaxed">
            온라인 접수와 가까운 수행기관 방문 접수 중 편한 방법을 선택하시면 됩니다.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <Building2 className="h-5 w-5 text-emerald-900" aria-hidden="true" />
            <h3 className="mt-3 text-base font-bold text-stone-900">방문 신청</h3>
            <p className="mt-1.5 text-sm text-stone-600 leading-relaxed">
              거주지 읍·면·동 행정복지센터(주민센터), 지역 시니어클럽, 노인복지관, 대한노인회 지회 직접 방문
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <Globe className="h-5 w-5 text-emerald-900" aria-hidden="true" />
            <h3 className="mt-3 text-base font-bold text-stone-900">온라인 신청</h3>
            <p className="mt-1.5 text-sm text-stone-600 leading-relaxed">
              노인일자리 여기(seniorro.or.kr), 복지로(bokjiro.go.kr), 정부24에서 거주지 공고 검색 및 온라인 접수
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <Calendar className="h-5 w-5 text-emerald-900" aria-hidden="true" />
            <h3 className="mt-3 text-base font-bold text-stone-900">모집 일정</h3>
            <p className="mt-1.5 text-sm text-stone-600 leading-relaxed">
              정기 모집은 매년 11월 말~12월에 집중 진행되며, 결원 발생 시 연중 수시 모집이 수시로 열립니다.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <Phone className="h-5 w-5 text-emerald-900" aria-hidden="true" />
            <h3 className="mt-3 text-base font-bold text-stone-900">대표 상담 전화</h3>
            <p className="mt-1.5 text-sm text-stone-600 leading-relaxed tabular-nums">
              노인일자리 상담 대표전화 <strong>1544-3388</strong> · 보건복지상담센터 <strong>129</strong> (평일 09:00~18:00)
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
