import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HIMAP Program Technology Profile Assessment",
  description: "Executive healthcare technology maturity diagnostic"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to main content</a>{children}</body></html>;
}
