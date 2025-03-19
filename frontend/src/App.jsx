import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout/Layout";
import HRDashboardPage from "./views/HR/Dashboard/Dashboard";
import HRAttendancePage from "./views/HR/Attendance/Attendance";
function App() {
  return (
    <Router>
      <Layout>
        <Routes>

        <Route path="/hr" element={<HRDashboardPage />} />
        <Route path="/hr/attendance" element={<HRAttendancePage />} />
          
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
