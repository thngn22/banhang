import React from "react";
import SideBarComponent from "../SideBar/SideBarComponent";

const DefaultPageAdmin = ({ children }) => {
  return (
    <div className="flex">
      <SideBarComponent />
      <div className="flex-grow overflow-y-auto min-h-screen ml-72">
        {children}
      </div>
    </div>
  );
};

export default DefaultPageAdmin;
