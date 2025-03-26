import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HRLayout from "./components/hr/Layout/Layout";
import EmployeeLayout from "./components/employee/Layout/Layout";

// HR Pages
import HRDashboardPage from "./views/HR/Dashboard/Dashboard";
import HRAttendancePage from "./views/HR/Attendance/Attendance";
import HRPendingDocs from "./views/HR/PendingDocuments/PendingDocuments";
import HRApprovedDocs from "./views/HR/ApprovedDocuments/ApprovedDocuments";
import LeaveManagement from './views/HR/LeaveManagement/LeaveManagement';
import AllEmployees from "./views/HR/AllEmployees/AllEmployees";

// Employee Pages
import EmployeeDashboardPage from "./views/Employee/Dashboard/Dashboard";
import EmployeeDocumentsPage from "./views/Employee/Documents/Documents";
import AddFilePage from "./views/Employee/AddFile/AddFile";
import EmployeeProfilePage from "./views/Employee/Profile/Profile";
import EmployeePayslipPage from './views/Employee/Payslip/Payslip';
import EmployeeViewTasksPage from './views/Employee/ViewTasks/ViewTasks';
import EmployeeViewFeedbackPage from './views/Employee/ViewFeedback/ViewFeedback';

//Manager Pages
import ManagerAddTaskPage from './views/Manager/AddTask/AddTask';
import ManagerSendFeedbackPage from './views/Manager/SendFeedback/SendFeedback';
import ManagerViewFeedbackPage from './views/Manager/ViewTasks/ViewTasks';

// Common Pages
import Login from "./views/Common/Login/login";

function App() {
  return (
    <Router>
      <Routes>
        {/* HR Routes */}
        <Route path="/hr" element={<HRLayout><HRDashboardPage /></HRLayout>} />
        <Route path="/hr/attendance" element={<HRLayout><HRAttendancePage /></HRLayout>} />
        <Route path="/hr/pending-docs" element={<HRLayout><HRPendingDocs /></HRLayout>} />
        <Route path="/hr/approved-docs" element={<HRLayout><HRApprovedDocs /></HRLayout>} />
        <Route path="/hr/leave-management" element={<HRLayout><LeaveManagement /></HRLayout>} />
        <Route path="/hr/all-employees" element={<HRLayout><AllEmployees /></HRLayout>} />
        
        {/* Employee Routes */}
        <Route path="/employee" element={<EmployeeLayout><EmployeeDashboardPage /></EmployeeLayout>} />
        <Route path="/employee/documents" element={<EmployeeLayout><EmployeeDocumentsPage /></EmployeeLayout>} />
        <Route path="/employee/documents/add" element={<EmployeeLayout><AddFilePage /></EmployeeLayout>} />
        <Route path="/employee/profile" element={<EmployeeLayout><EmployeeProfilePage /></EmployeeLayout>} />
        <Route path="/employee/payslip" element={<EmployeeLayout><EmployeePayslipPage /></EmployeeLayout>} />
        <Route path="/employee/viewtasks" element={<EmployeeLayout><EmployeeViewTasksPage /></EmployeeLayout>}/>
        <Route path="/employee/viewfeedback" element={<EmployeeLayout><EmployeeViewFeedbackPage /></EmployeeLayout>}/>

        {/* Manager Routes */}
        <Route path="/manager/addtask" element={<ManagerAddTaskPage />}/>
        <Route path="/manager/sendfeedback" element={<ManagerSendFeedbackPage />}/>
        <Route path="/manager/viewtasks" element={<ManagerViewFeedbackPage />}/>


        {/* Common Routes */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;