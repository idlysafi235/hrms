import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";

import Attendance from "./pages/Attendance/Attendance";
import Layout from "./components/Layout";
import Profile from "./pages/profile/Profile";
import RaiseHRRequests from "./pages/profile/HRRequests";
import MyAssets from "./pages/profile/MyAssets";

import LeaveNavbar from "./components/Layouts/LeaveNavbar";
import AttendanceNavbar from "./components/Layouts/AttendanceNavbar";
import SelfServiceNavbar from "./components/Layouts/SelfServiceNavbar";
import PayNavbar from "./components/Layouts/PayNavbar";
import AssetsNavbar from "./components/Layouts/AssetsNavbar";
import ApplyLeave from "./pages/leaves/ApplyLeave";
import LeaveDashboard from "./pages/leaves/LeaveDashboard";
import LeaveManagement from "./pages/leaves/LeaveManagement";
import AssetDashboard from "./pages/assets/AssetDashboard";
import AssetListTab from "./pages/assets/AssetListTab";

import AssetRequests from "./pages/assets/AssetRequests";
import AttendanceHistory from "./pages/Attendance/AttendanceHistory";
import Timesheet from "./pages/Timesheet/Timesheet";
import TimesheetDashboard from "./pages/Attendance/TimesheetDashboard";
import OnboardNavbar from "./components/Layouts/OnboardNavbar";
// import NewEmployee from "./pages/EmployeeHub/NewEmployee";
import OnboardingProgress from "./pages/EmployeeHub/OnboardingProgress";

import EmployeeManagement from "./pages/EmployeeHub/EmployeeManagement";
import HRRequests from "./pages/HRRequests/HRRequests";
import Management from "./pages/Management/Management";
import Teams from "./pages/Teamss/Teams";
import OnboardingNavbar from "./components/Layouts/OnboardingNavbar";
import PersonalInfoForm from "./pages/Onboarding/PersonalInfoForm";
import ContactAddressForm from "./pages/Onboarding/ContactAddressForm";
import EducationForm from "./pages/Onboarding/EducationForm";
import ExperienceForm from "./pages/Onboarding/ExperienceForm";
import SkillsCertsForm from "./pages/Onboarding/SkillsCertsForm";
import ReviewSubmitForm from "./pages/Onboarding/ReviewSubmitForm";
import BankForm from "./pages/Onboarding/BankForm";
import MgmtNavbar from "./components/Layouts/MgmtNavbar";
import Events from "./pages/Management/Events";
import Holidays from "./pages/Management/Holidays";
import MgmtAnnouncements from "./pages/Management/MgmtAnnouncements";
import TeamNavbar from "./components/Layouts/TeamNavbar";
import MyTeam from "./pages/Teamss/MyTeam";
import HubDashboard from "./pages/EmployeeHub/HubDashboard";
import PayDashboard from "./pages/PayRollall/Admin/PayDashboard";
import RunPayrollMock from "./pages/pay1/RunPayrollMock";
import EmployeePayDataMock from "./pages/pay1/EmployeePayDataMock";
import PayrollSummaryMock from "./pages/pay1/PayrollSummaryMock";
import TaxDocumentsMock from "./pages/pay1/TaxDocumentsMock";
import TaxWithholdingMock from "./pages/pay1/TaxWithholdingMock";
import BankInfoMock from "./pages/pay1/BankInfoMock";
import MyPayslipsMock from "./pages/pay1/MyPayslipsMock";
import UserRolesMock from "./pages/pay1/UserRolesMock";
import PaySettingsMock from "./pages/pay1/PaySettingsMock";
import LedgerMock from "./pages/pay1/LedgerMock";
import ReportsMock from "./pages/pay1/ReportsMock";
import PayPoliciesMock from "./pages/pay1/PayPoliciesMock";
import TaxSetupMock from "./pages/PayRollall/Admin/TaxSetupMock";
import BenefitsMock from "./pages/pay1/BenefitsMock";
import PayNavbarMain from "./components/Layouts/paynavbar1";
import SalarySlip from "./pages/PayRollall/pay/SalarySlip";
import OffCyclePayslip from "./pages/PayRollall/pay/OffCyclePayslip";
import PayRegister from "./pages/PayRollall/pay/PayRegister";
import CompensationPlan from "./pages/PayRollall/pay/CompensationPlan";
import VPF from "./pages/PayRollall/pay/VPF";
import TaxComputation from "./pages/PayRollall/Tax/TaxComputation";
import TaxCalculations from "./pages/PayRollall/Tax/TaxCalculations";
import ProofSubmission from "./pages/PayRollall/Tax/ProofSubmission";
import Form16Details from "./pages/PayRollall/Tax/Form16Details";
import MyTickets from "./pages/PayRollall/Helpdesk/MyTickets";
import EmployeeProfile from "./pages/PayRollall/Utilities/EmployeeProfile";
import AadharPanLink from "./pages/PayRollall/Utilities/AadharPanLink";
import ESI from "./pages/PayRollall/Utilities/ESI";
import Form11 from "./pages/PayRollall/Utilities/Form11";
import ContributionFund from "./pages/PayRollall/Utilities/ContributionFund";
import ReimbursementSubmission from "./pages/PayRollall/reiumbursment/ReimbursementSubmission";
import ReimbursementSlip from "./pages/PayRollall/reiumbursment/ReimbursementSlip";
import ReimbursementClaimHistory from "./pages/PayRollall/reiumbursment/ClaimHistory";
import TaxDeclarations from "./pages/PayRollall/Tax/TaxDeclarations";
import SalaryStructure from "./pages/PayRollall/HR/SalaryStructure";
import EmployeePaySettings from "./pages/PayRollall/HR/EmployeePaySettings";
import PayrollSettings from "./pages/PayRollall/HR/PayrollSettings";
import OffCyclePay from "./pages/PayRollall/HR/OffCyclePay";
import RunPayroll from "./pages/PayRollall/Finance/RunPayroll";
import TDSSummary from "./pages/PayRollall/Finance/TDSSummary";
import AuditLog from "./pages/PayRollall/Finance/AuditLog";
import OrganizationSetup from "./pages/PayRollall/Admin/OrganizationSetup";
import PayComponentMaster from "./pages/PayRollall/Admin/PayComponentMaster";
import SalaryStructureTemplates from "./pages/PayRollall/Admin/SalaryStructureTemplates";
import PayrollConfiguration from "./pages/PayRollall/Admin/PayrollConfiguration";
import ImportTools from "./pages/PayRollall/Admin/ImportTools";
import DocumentManagement from "./pages/PayRollall/Admin/DocumentManagement";
import AuditLogs from "./pages/PayRollall/Admin/AuditLogs";
import BankAdvice from "./pages/PayRollall/Finance/BankAdvice";
import FinalSettlement from "./pages/PayRollall/Finance/FinalSettlement";
import PayoutApprovals from "./pages/PayRollall/Finance/PayoutApprovals";
import LeaveAdjustments from "./pages/PayRollall/HR/LeaveAdjustments";
import PayrollRemarks from "./pages/PayRollall/HR/PayrollRemarks";
import PayHome from "./pages/PayRollall/pay/PayHome";
import DeclarationsApproval from "./pages/PayRollall/Finance/DeclarationsApproval";
import TaxConfig from "./pages/PayRollall/Admin/TaxConfig";
import FinanceReports from "./pages/PayRollall/Finance/FinanceReports";
import ReimbursmentApprovals from "./pages/PayRollall/Finance/ReimbursmentApprovals";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingNavbar />
            </ProtectedRoute>
          }
        >
          <Route path="personal-info" element={<PersonalInfoForm />} />
          <Route path="contact-address" element={<ContactAddressForm />} />
          <Route path="education" element={<EducationForm />} />
          <Route path="experience" element={<ExperienceForm />} />
          <Route path="skills-certs" element={<SkillsCertsForm />} />
          <Route path="bank-tax" element={<BankForm />} />
          <Route path="review" element={<ReviewSubmitForm />} />
        </Route>

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<Home />} />
  
          <Route path="attendance" element={<Attendance />} />

          <Route path="profile" element={<SelfServiceNavbar />}>
            <Route index element={<Profile />} />
            <Route path="profile" element={<Profile />} />
            <Route path="assets" element={<MyAssets />} />
            <Route path="hr-requests" element={<RaiseHRRequests />} />

          </Route>

          <Route path="assets" element={<AssetsNavbar />}>
            <Route path="dashboard" element={<AssetDashboard />} />
            <Route path="list" element={<AssetListTab />} />
            <Route path="requests" element={<AssetRequests />} />
          </Route>

          <Route path="leaves/*" element={<LeaveNavbar />}>
            <Route index element={<Navigate to="apply" replace />} />
            <Route path="apply" element={<ApplyLeave />} />
            <Route path="dashboard" element={<LeaveDashboard />} />
            <Route path="management" element={<LeaveManagement />} />
          </Route>

          {/* <Route path="Organization/OrganizationHierarchy" element={<OrganizationHierarchy />} /> */}

          <Route path="attendance" element={<AttendanceNavbar />}>
            <Route path="daily" element={<Attendance />} />
            <Route path="AttendanceHistory" element={<AttendanceHistory />} />
            <Route path="timesheet" element={<Timesheet />} />
            <Route path="timesheetdashboard" element={<TimesheetDashboard />} />
          </Route>

          <Route path="employeehub" element={<OnboardNavbar />}>
            <Route path="dashboard" element={<HubDashboard />} />
            {/* <Route path="new-employee" element={<NewEmployee />} /> */}
            <Route path="progress" element={<OnboardingProgress />} />
            <Route path="employeesdata" element={<EmployeeManagement />} />
          </Route>

          <Route path="mgmt" element={<MgmtNavbar />}>
            <Route path="announcements" element={<MgmtAnnouncements />} />
            <Route path="events" element={<Events />} />
            <Route path="holidays" element={<Holidays />} />
          </Route>

          <Route path="team" element={<TeamNavbar />}>
            <Route path="allteams" element={<Teams />} />
            <Route path="myteam" element={<MyTeam />} />
          </Route>

          <Route path="hrrequests" element={<HRRequests />} />
          {/* <Route path="help" element={<HelpPage />} /> */}
          <Route path="management" element={<Management />} />
          

          {/* <Route path="inbox/announcements" element={<InboxAnnouncementsForm />} />
          <Route path="inbox/messages" element={<InboxMessagesForm />} />
          <Route path="inbox/notifications" element={<InboxNotificationsForm />} /> */}

          <Route path="pay" element={<PayNavbar />}>
            <Route path="pay" element={<PayHome />} />
            {/* <Route path="tax" element={<Tax />} /> */}
            {/* <Route path="dashboard" element={<PayrollDashboard />} /> */}
            <Route path="pay/pay-slip" element={<SalarySlip />} />
            <Route path="pay/offcycle-slip" element={<OffCyclePayslip />} />
            <Route path="pay/pay-register" element={<PayRegister />} />
            <Route path="pay/compensation-plan" element={<CompensationPlan />} />
            <Route path="pay/vpf" element={<VPF />} />
            <Route path="reimbursment/submission" element={<ReimbursementSubmission />} />
            <Route path="reimbursment/slip" element={<ReimbursementSlip />} />
            <Route path="reimbursment/history" element={<ReimbursementClaimHistory />} />
            <Route path="tax/computation" element={<TaxComputation />} />
            <Route path="tax/calculations" element={<TaxCalculations />} />
            <Route path="tax/declarations" element={<TaxDeclarations />} />
            <Route path="tax/proof-submission" element={<ProofSubmission />} />
            <Route path="tax/form16" element={<Form16Details />} />
            <Route path="helpdesk/tickets" element={<MyTickets />} />
            <Route path="utilities/profile" element={<EmployeeProfile />} />
            <Route path="utilities/aadharpan" element={<AadharPanLink />} />
            <Route path="utilities/esi" element={<ESI />} />
            <Route path="utilities/form11" element={<Form11 />} />
            <Route path="utilities/fund" element={<ContributionFund />} />
            <Route path="dashboard" element={<PayDashboard />} />
            <Route path= "hr/salary-structure" element={<SalaryStructure/>} />
            <Route path= "hr/employee-pay-settings" element={<EmployeePaySettings/>} />
            <Route path= "hr/leave-adjustments" element={<LeaveAdjustments/>} />
            <Route path= "hr/payroll-remarks" element={<PayrollRemarks/>} />
            <Route path= "hr/payroll-settings" element={<PayrollSettings/>} />
            <Route path= "hr/offcycle-pay" element={<OffCyclePay/>} />
            <Route path= "finance/payroll-run" element={<RunPayroll/>} />
            <Route path= "finance/declarations" element={<DeclarationsApproval/>} />
            <Route path= "finance/rmb" element={<ReimbursmentApprovals/>} />
            <Route path= "finance/bank-advice" element={<BankAdvice/>} />
            <Route path= "finance/final-settlement" element={<FinalSettlement/>} />
            <Route path= "finance/tds-summary" element={<TDSSummary/>} />
            <Route path= "finance/reports" element={<FinanceReports/>} />
            <Route path= "finance/audit-log" element={<AuditLog/>} />
            <Route path= "finance/payout-approvals" element={<PayoutApprovals/>} />
            <Route path="admin/tax-config" element={<TaxSetupMock />} />
            <Route path="admin/organization-setup" element={<OrganizationSetup />} />
            <Route path="admin/pay-component-master" element={<PayComponentMaster />} />
            <Route path="admin/salary-structure-templates" element={<SalaryStructureTemplates />} />
            <Route path="admin/payroll-config" element={<PayrollConfiguration />} />
            <Route path="admin/import-tools" element={<ImportTools />} />
            <Route path="admin/document-management" element={<DocumentManagement />} />
            <Route path="admin/audit-logs" element={<AuditLogs />} />
            <Route path="admin/tax-slab-setup" element={<TaxConfig />} />
          </Route>

          {/* <Route path="pay" element={<PayNavbarMain />}>
           <Route path="dashboard" element={<DashboardMock />} />
           <Route path="run" element={<RunPayrollMock />} />
           <Route path="employees" element={<EmployeePayDataMock />} />
           <Route path="summary" element={<PayrollSummaryMock />} />
           <Route path="benefits" element={<BenefitsMock />} />
           <Route path="taxes" element={<TaxSetupMock />} />
           <Route path="policies" element={<PayPoliciesMock />} />
           <Route path="reports" element={<ReportsMock />} />
           <Route path="ledger" element={<LedgerMock />} />
           <Route path="settings" element={<PaySettingsMock />} />
           <Route path="userroles" element={<UserRolesMock />} />
           <Route path="mypayslips" element={<MyPayslipsMock />} />
           <Route path="bankinfo" element={<BankInfoMock />} />
           <Route path="w4" element={<TaxWithholdingMock />} />
           <Route path="documents" element={<TaxDocumentsMock />} />
         </Route> */}

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
