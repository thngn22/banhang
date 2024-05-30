import { useNavigate, useLocation } from "react-router-dom";
import AppRouter from "./routes/index.js";
import { useEffect } from "react";

import { useSelector } from "react-redux";

function App() {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth.login.currentUser);
  // console.log(auth);

  const location = useLocation(); // Sử dụng hook useLocation để lấy thông tin về địa chỉ hiện tại
  const currentPath = location.pathname;
  useEffect(() => {
    if (currentPath === "/admin" && (!auth || !auth.isAdmin)) {
      navigate("/");
    }
  }, [currentPath]);

  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;
