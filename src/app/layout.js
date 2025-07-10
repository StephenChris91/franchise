import SiteNavbar from "@/components/Navbar";
import "./globals.css";
import { Montserrat, Roboto, Oswald, Ubuntu } from "next/font/google";
import SiteFooter from "@/components/Footer";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import AudioPlayerBar from "@/components/sermons/AudioPlayerBar";

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
        <AudioPlayerProvider>
          <SiteNavbar />
          {children}
          <SiteFooter />
          <AudioPlayerBar />
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
