import React from "react";
import Navigation from "../Navigation/Navigation";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";

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
