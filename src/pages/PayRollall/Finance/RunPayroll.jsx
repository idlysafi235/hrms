import React, { useEffect, useState } from 'react';
import PayrollForm from '../../../components/PayRoll/PayrollForm';
import KPICards from '../../../components/PayRoll/KPICards';
import Alerts from '../../../components/PayRoll/Alerts';
import PayrollTables from '../../../components/PayRoll/PayrollTables';
import PayrollModal from '../../../components/PayRoll/PayrollModal';
import { runPayroll, fetchAllPayrolls } from '../../../api/payrollService';
import { getToken } from '../../../utils/auth';
import { notifyError } from '../../../components/Toast/ToastProvider';
import './RunPayroll.css';

const RunPayroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [message, setMessage] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedPayroll, setSelectedPayroll] = useState(null);

  const [summary, setSummary] = useState(null);
  const [processed, setProcessed] = useState([]);
  const [skipped, setSkipped] = useState([]);

  const [showMessageDetails, setShowMessageDetails] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const token = getToken();

  const handleGenerate = async () => {
    if (!month || !year) {
      setMessage('Please select valid month and year');
      return;
    }

    try {
      setIsLoading(true);
      setMessage('');
      setProcessed([]);
      setSkipped([]);

      const body = { month, year };
      const result = await runPayroll(token, body);

      if (result.success) {
        setMessage('Payroll generated successfully!');
        setSummary(result.summary);
        setProcessed(result.processedEmployees || []);
        setSkipped(result.skippedEmployees || []);
        await loadPayrolls();
      } else {
        setMessage(`❌ ${result.message}`);
      }
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPayrolls = async () => {
    try {
      const records = await fetchAllPayrolls(token);
      setPayrolls(Array.isArray(records) ? records : []);
    } catch (error) {
      notifyError('Load payrolls error:', error);
      setPayrolls([]);
    }
  };

  useEffect(() => {
    loadPayrolls();
  }, []);

  const showModal = (payroll) => setSelectedPayroll(payroll);
  const closeModal = () => setSelectedPayroll(null);

  return (
    <div className="run-payroll-container">
      <h2>Run Payroll</h2>

      <PayrollForm
        employeeId={employeeId}
        setEmployeeId={setEmployeeId}
        month={month}
        setMonth={setMonth}
        year={year}
        setYear={setYear}
        handleGenerate={handleGenerate}
        isLoading={isLoading}
      />

      <KPICards summary={summary} />

      <Alerts
        message={message}
        showMessageDetails={showMessageDetails}
        setShowMessageDetails={setShowMessageDetails}
        summary={summary}
        processed={processed}
        skipped={skipped}
        showErrors={showErrors}
        setShowErrors={setShowErrors}
      />

      <PayrollTables payrolls={payrolls} showModal={showModal} />

      {selectedPayroll && (
        <PayrollModal payroll={selectedPayroll} onClose={closeModal} />
      )}
    </div>
  );
};

export default RunPayroll;
