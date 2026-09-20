import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'CaseCarry — Don’t tell your story again',
  description: 'Turn your previous reports, complaints, responses, and evidence into one clear, verified case record you can carry forward when the issue remains unresolved.',
  openGraph: {
    title: 'CaseCarry — Don’t tell your story again',
    description: 'Turn your previous reports, complaints, responses, and evidence into one clear, verified case record you can carry forward when the issue remains unresolved.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CaseCarry — Don’t tell your story again',
    description: 'Turn your previous reports, complaints, responses, and evidence into one clear, verified case record you can carry forward when the issue remains unresolved.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        suppressHydrationWarning
        className="bg-[#F8F7F3] text-[#172033] min-h-screen antialiased selection:bg-[#2457C5]/15 selection:text-[#172033] font-sans"
      >
        {children}
      </body>
    </html>
  );
}
