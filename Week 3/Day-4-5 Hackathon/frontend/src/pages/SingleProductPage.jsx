import Header from "../components/Header";
import Footer from "../components/Footer";
import AboutContainer from "../components/AboutItem";
import SingleItem from "../components/SingleItem";

export default function SingleProductPage() {
  return (
    <main className="max-w-320 mx-auto">
      <Header />
      <SingleItem/>
   
     <AboutContainer/>
      <Footer />
    </main>
  );
}