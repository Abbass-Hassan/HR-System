import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HRLayout from "./components/hr/Layout/Layout";
import EmployeeLayout from "./components/employee/Layout/Layout";

// HR Pages
import HRDashboardPage from "./views/HR/Dashboard/Dashboard";
import HRAttendancePage from "./views/HR/Attendance/Attendance";
import HRPendingDocs from "./views/HR/PendingDocuments/PendingDocuments";
import HRApprovedDocs from "./views/HR/ApprovedDocuments/ApprovedDocuments";

// Employee Pages
import EmployeeDashboardPage from "./views/Employee/Dashboard/Dashboard";
import EmployeeDocumentsPage from "./views/Employee/Documents/Documents";

function App() {
  return (
    <Router>
      <Routes>
        {/* HR Routes */}
        <Route path="/hr" element={<HRLayout><HRDashboardPage /></HRLayout>} />
        <Route path="/hr/attendance" element={<HRLayout><HRAttendancePage /></HRLayout>} />
        <Route path="/hr/pending-docs" element={<HRLayout><HRPendingDocs /></HRLayout>} />
        <Route path="/hr/approved-docs" element={<HRLayout><HRApprovedDocs /></HRLayout>} />
        
        {/* Employee Routes */}
        <Route path="/employee" element={<EmployeeLayout><EmployeeDashboardPage /></EmployeeLayout>} />
        <Route path="/employee/documents" element={<EmployeeLayout><EmployeeDocumentsPage /></EmployeeLayout>} />
        
      </Routes>
    </Router>
  );
}

export default App;