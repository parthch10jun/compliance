import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components";
import { DemoWizardProvider } from "@/contexts/DemoWizardContext";
import DemoWizard from "@/components/DemoWizard";
import DemoWizardLauncher from "@/components/DemoWizardLauncher";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ascent - Compliance Platform",
  description: "Regulatory compliance management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased`}>
        <DemoWizardProvider>
          <Shell>{children}</Shell>
          <DemoWizard />
          <DemoWizardLauncher />
        </DemoWizardProvider>
      </body>
    </html>
  );
}
