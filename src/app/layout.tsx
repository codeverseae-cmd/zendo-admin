import { Montserrat, IBM_Plex_Sans_Arabic } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { ReduxStoreProvider } from "../store/provider";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-ibm-plex-sans-arabic",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Zendo Admin — Dashboard",
  description: "Zendo Admin Panel — Manage products, categories, brands, and orders for your Zendo store.",
  keywords: ["Zendo", "Admin", "Dashboard", "ERP", "Product Management"],
  authors: [{ name: "Zendo" }],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Zendo Admin — Dashboard",
    description: "Manage your Zendo store from one powerful admin panel.",
    siteName: "Zendo Admin",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${montserrat.variable} ${ibmPlexSansArabic.variable}`}>
      <body className={`${montserrat.className} antialiased`}>
        <ReduxStoreProvider>
          {children}
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              style: {
                background: '#0F0F0F',
                color: '#FFFFFF',
                border: '1px solid #222222',
                fontSize: '0.875rem',
                fontWeight: 500,
              },
            }}
          />
        </ReduxStoreProvider>
      </body>
    </html>
  );
}