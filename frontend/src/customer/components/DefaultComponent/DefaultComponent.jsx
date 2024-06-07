import React from "react";
import Navigation from "../Navigation/Navigation";
import Footer from "../Footer/Footer";
import Chat from "../Chat/Chat";
import { useSelector } from "react-redux";

function DefaultComponent({ children }) {
  const auth = useSelector((state) => state.auth.login.currentUser);

  return (
    <div>
      <Navigation />
      {children}
      {auth && !auth.isAdmin && <Chat />}
      <Footer />
    </div>
  );
}

export default DefaultComponent;
