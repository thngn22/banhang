import { useNavigate, useLocation } from "react-router-dom";
import AppRouter from "./routes/index.js";
import { useEffect } from "react";

import { useSelector } from "react-redux";

function App() {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth.login.currentUser);

  const location = useLocation();
  const currentPath = location.pathname;
  useEffect(() => {
    if (currentPath === "/admin" && (!auth || !auth.isAdmin)) {
      navigate("/");
    }
  }, []);

  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;
