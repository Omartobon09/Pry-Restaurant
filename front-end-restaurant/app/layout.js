//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "/node_modules/primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "./globals.css";
export const metadata = {
  title: "Restaurante-Festin",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="sb-nav-fixed">{children}</body>
    </html>
  );
}
