import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#F8F7F3] text-[#172033]">
      <div className="max-w-md p-8 bg-white rounded-2xl border border-[#D9DEE7] shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-[#172033]">Page Not Found</h2>
        <p className="text-sm text-[#526071] leading-relaxed">
          The requested page or resource could not be found. You can return to CaseCarry home to continue your case.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-4 py-2 bg-[#2457C5] hover:bg-[#1D46A0] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          Return to CaseCarry
        </Link>
      </div>
    </div>
  );
}
