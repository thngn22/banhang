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
      <div className="mt-20">
        {children}
        {auth && !auth.isAdmin && <Chat />}
      </div>
      <Footer />
    </div>
  );
}

export default DefaultComponent;
