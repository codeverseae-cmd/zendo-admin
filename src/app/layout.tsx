import { Toaster } from "react-hot-toast";
import "./globals.css";
import { ReduxStoreProvider } from "../store/provider";

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin panel for product management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxStoreProvider>
          {children}
          <Toaster position="top-right" reverseOrder={false} />
        </ReduxStoreProvider>
      </body>
    </html>
  );
}