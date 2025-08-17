// LandingPage.jsx
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <main className="max-w-320 mx-auto">
      <Header />

      <h1 className="text-4xl font-bold text-center py-10">
        Welcome to My Store
      </h1>

      {/* Footer should always be here */}
      <Footer />
    </main>
  );
}
