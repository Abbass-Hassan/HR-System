import React from "react";
import Sidebar from "../../hr/Sidebar/Sidebar";

const Layout = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "1rem" }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
