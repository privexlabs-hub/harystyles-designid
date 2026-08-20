import type { Metadata, Viewport } from "next";
import "./fonts.css";
import "./tokens.css";
import "./globals.css";
import { ThemeScript } from "@/components/ThemeScript";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: {
    default: "harystyles — brand identity playbook",
    template: "%s · harystyles",
  },
  description:
    "The harystyles design system: brand, type, colour, spacing, components, product screens, and an editor for producing branded assets.",
  applicationName: "harystyles",
  manifest: "/assets/favicon/site.webmanifest",
  icons: {
    icon: [
      { url: "/assets/favicon/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/assets/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/assets/favicon/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/assets/favicon/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/assets/favicon/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "harystyles — brand identity playbook",
    description: "Letters, not posts.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0d18",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
