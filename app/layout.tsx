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
      <head>
        <script
          id="browser-runtime-polyfill"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;
                
                // Polyfill ResizeObserver
                if (typeof window.ResizeObserver === 'undefined') {
                  window.ResizeObserver = class ResizeObserver {
                    constructor(callback) {
                      this.callback = typeof callback === 'function' ? callback : function() {};
                      this.targets = new Set();
                    }
                    observe(target) {
                      if (target) this.targets.add(target);
                    }
                    unobserve(target) {
                      if (target) this.targets.delete(target);
                    }
                    disconnect() {
                      this.targets.clear();
                    }
                  };
                }

                // Polyfill IntersectionObserver
                if (typeof window.IntersectionObserver === 'undefined') {
                  window.IntersectionObserver = class IntersectionObserver {
                    constructor(callback) {
                      this.callback = typeof callback === 'function' ? callback : function() {};
                      this.targets = new Set();
                    }
                    observe(target) {
                      if (target) this.targets.add(target);
                    }
                    unobserve(target) {
                      if (target) this.targets.delete(target);
                    }
                    disconnect() {
                      this.targets.clear();
                    }
                    takeRecords() { return []; }
                  };
                }

                // Polyfill requestIdleCallback
                if (typeof window.requestIdleCallback === 'undefined') {
                  window.requestIdleCallback = function(cb) {
                    var start = Date.now();
                    return setTimeout(function() {
                      cb({
                        didTimeout: false,
                        timeRemaining: function() {
                          return Math.max(0, 50 - (Date.now() - start));
                        }
                      });
                    }, 1);
                  };
                  window.cancelIdleCallback = function(id) {
                    clearTimeout(id);
                  };
                }

                // Polyfill structuredClone if missing
                if (typeof window.structuredClone === 'undefined') {
                  window.structuredClone = function(val) {
                    return JSON.parse(JSON.stringify(val));
                  };
                }

                // Polyfill Streams API if missing
                if (typeof window.ReadableStream === 'undefined') {
                  window.ReadableStream = class ReadableStream {
                    constructor() {}
                    getReader() {
                      return {
                        read: () => Promise.resolve({ done: true, value: undefined }),
                        releaseLock: () => {}
                      };
                    }
                  };
                }
                if (typeof window.WritableStream === 'undefined') {
                  window.WritableStream = class WritableStream {
                    constructor() {}
                    getWriter() {
                      return {
                        write: () => Promise.resolve(),
                        close: () => Promise.resolve(),
                        releaseLock: () => {}
                      };
                    }
                  };
                }
                if (typeof window.TransformStream === 'undefined') {
                  window.TransformStream = class TransformStream {
                    constructor() {
                      this.readable = new window.ReadableStream();
                      this.writable = new window.WritableStream();
                    }
                  };
                }

                // Polyfill BroadcastChannel if missing
                if (typeof window.BroadcastChannel === 'undefined') {
                  window.BroadcastChannel = class BroadcastChannel {
                    constructor(name) { this.name = name; }
                    postMessage() {}
                    close() {}
                    addEventListener() {}
                    removeEventListener() {}
                  };
                }
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-[#F8F7F3] text-[#172033] min-h-screen antialiased selection:bg-[#2457C5]/15 selection:text-[#172033] font-sans"
      >
        {children}
      </body>
    </html>
  );
}
