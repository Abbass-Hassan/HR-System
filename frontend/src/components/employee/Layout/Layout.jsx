import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./Layout.css";
import AiChatbot from "../../common/AiChatbot/AiChatbot";

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="layout-main">
        {children}
      </main>
      <AiChatbot/>
    </div>
  );
};

export default Layout;