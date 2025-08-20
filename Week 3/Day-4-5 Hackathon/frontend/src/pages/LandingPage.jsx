// LandingPage.jsx
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Collections from "../components/Collections";

export default function LandingPage() {
  return (
    <main className="max-w-320 mx-auto">
    

      <Hero />
      <Features />
      <Collections />

   
    </main>
  );
}
