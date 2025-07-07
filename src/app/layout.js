// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import "./globals.css";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import { Bebas_Neue } from "next/font/google";

// const bebas = Bebas_Neue({
//   weight: "400",
//   subsets: ["latin"],
//   variable: "--font-bebas",
// });

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// // app/layout.js

// export const metadata = {
//   title: "Franchise Church",
//   description: "We envision all men celebrating endless life in Christ.",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en" className={bebas.variable} suppressHydrationWarning>
//       <body>
//         <Navbar />
//         <main>{children}</main>
//         <Footer />
//       </body>
//     </html>
//   );
// }

import SiteNavbar from "@/components/Navbar";
import "./globals.css";
import { Montserrat, Roboto, Oswald, Ubuntu } from "next/font/google";
import SiteFooter from "@/components/Footer";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-heading",
});

const ubuntuBody = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-body",
});

export const metadata = {
  title: "Franchise Church",
  description: "We envision all men celebrating endless life in Christ.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${ubuntu.variable} ${ubuntuBody.variable}`}>
      <body className="font-body">
        <SiteNavbar />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
