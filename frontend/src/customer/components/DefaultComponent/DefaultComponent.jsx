import React from "react";
import Navigation from "../Navigation/Navigation";
import Footer from "../Footer/Footer";
import Chat from "../Chat/Chat";

function DefaultComponent({ children }) {
  return (
    <div>
      <Navigation />
      {children}
      <Chat />
      <Footer />
    </div>
  );
}

export default DefaultComponent;
