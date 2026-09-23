import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'CaseCarry',
  description: 'Citizen-controlled case continuity tool that turns scattered reports, complaints, responses, and evidence into a clear, verified, portable case record to carry forward when issues remain unresolved.',
  openGraph: {
    title: 'CaseCarry',
    description: 'Citizen-controlled case continuity tool that turns scattered reports, complaints, responses, and evidence into a clear, verified, portable case record to carry forward when issues remain unresolved.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CaseCarry',
    description: 'Citizen-controlled case continuity tool that turns scattered reports, complaints, responses, and evidence into a clear, verified, portable case record to carry forward when issues remain unresolved.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-[#F8F7F3] text-[#172033] min-h-screen antialiased selection:bg-[#2457C5]/15 selection:text-[#172033] font-sans"
      >
        {children}
      </body>
    </html>
  );
}
