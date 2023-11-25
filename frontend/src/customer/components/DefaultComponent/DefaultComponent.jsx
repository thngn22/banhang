import React from "react";
import Navigation from "../Navigation/Navigation";
import Footer from "../Footer/Footer";

function DefaultComponent({ children }) {
  return (
    <div>
      <Navigation />
      {children}
      <Footer />
    </div>
  );
}

export default DefaultComponent;
