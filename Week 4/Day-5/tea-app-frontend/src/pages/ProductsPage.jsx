import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductHero from "../components/ProductHero";
import Selection from "../components/Selection";

export default function ProductsPage() {
  return (
    <main className="max-w-320 mx-auto">
    
        <ProductHero/>
        <Selection/>

    </main>
  );
}