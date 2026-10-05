import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HIMAP Technology Profile Assessment",
  description: "Healthcare Information Management Association of the Philippines Technology Profile Assessment"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to main content</a>{children}<footer className="brand-footer"><img src="/powered-by-concentrix.png" alt="Powered by Concentrix" width="180"/></footer></body></html>;
}
