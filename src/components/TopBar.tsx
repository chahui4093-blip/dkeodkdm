import React from 'react';

interface TopBarProps {
  onStartDiagnostic: () => void;
  hasCompletedResult: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ onStartDiagnostic, hasCompletedResult }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-[#F8F7F3]/95 backdrop-blur-sm no-print">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
        <a
          href="#top"
          className="font-editorial text-lg font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800"
        >
          시니어 일자리 나침반
        </a>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600" aria-label="주요 메뉴">
          <a
            href="#diagnostic"
            className="hover:text-stone-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            자격진단
          </a>
          <a
            href="#programs"
            className="hover:text-stone-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            사업유형 안내
          </a>
          <a
            href="#documents"
            className="hover:text-stone-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            준비서류
          </a>
          <a
            href="#apply"
            className="hover:text-stone-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            신청방법
          </a>
        </nav>

        <div className="shrink-0">
          <button
            type="button"
            onClick={onStartDiagnostic}
            className="rounded-lg bg-emerald-900 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 active:scale-[0.99] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
          >
            {hasCompletedResult ? '진단 다시하기' : '자격진단 시작'}
          </button>
        </div>
      </div>
    </header>
  );
};
