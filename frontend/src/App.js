import "./App.css";
import Footer from "./customer/components/Footer/Footer";
import Navigation from "./customer/components/Navigation/Navigation";
import HomePage from "./customer/pages/HomePage/HomePage";

function App() {
  return (
    <div className="App">
      <div className="">
        <Navigation />
      </div>
      <HomePage />

      <Footer />
    </div>
  );
}

export default App;
