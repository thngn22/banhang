import "./App.css";
import Footer from "./customer/components/Footer/Footer";
import Navigation from "./customer/components/Navigation/Navigation";

import { Routes, Route } from "react-router-dom";
import { routes } from "./routes/index.js";
import { Fragment } from "react";
import DefaultComponent from "./customer/components/DefaultComponent/DefaultComponent";

function App() {
  return (
    <div className="App">
      <Routes>
        {routes.map((route) => {
          const Page = route.page;
          const Layout = route.isShowHeadAndFoot ? DefaultComponent : Fragment;
          return (
            <Route
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}
      </Routes>
    </div>
  );
}

export default App;
