import "./App.css";
import Footer from "./customer/components/Footer/Footer";
import Navigation from "./customer/components/Navigation/Navigation";
import HomePage from "./customer/pages/HomePage/HomePage";
import ProductDetailPage from "./customer/pages/ProductDetail/ProductDetailPage";
import ProductDetail from "./customer/pages/ProductDetail/ProductDetailPage";
import ProductPage from "./customer/pages/ProductPage/ProductPage";

function App() {
  return (
    <div className="App">
      <div className="">
        <Navigation />
      </div>

      {/* <HomePage /> */}
      {/* <ProductPage /> */}
      <ProductDetailPage />

      <Footer />
    </div>
  );
}

export default App;
