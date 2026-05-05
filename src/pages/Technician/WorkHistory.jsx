import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Breadcrumb from '../../components/Breadcrumb';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Alert from '../../components/Alert';
import { TECHNICIAN_MENU } from '../../utils/menuConfig';
import { bookingsAPI, getUser } from '../../utils/api';

/**
 * Work History Page
 * View completed service jobs
 */
const WorkHistory = () => {
  const currentUser = getUser();
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const TECH_EARNING_RATE = 0.8;

  const parseJobDate = (value) => {
    if (!value) return null;
    const direct = new Date(value);
    if (!Number.isNaN(direct.getTime())) return direct;
    const normalized = new Date(`${value}T00:00:00`);
    return Number.isNaN(normalized.getTime()) ? null : normalized;
  };

  const parsePriceValue = (value) => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;
    const match = String(value).match(/[\d,.]+/);
    if (!match) return 0;
    const numeric = Number(match[0].replace(/,/g, ''));
    return Number.isNaN(numeric) ? 0 : numeric;
  };

  const formatCurrency = (value) =>
    `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await bookingsAPI.getAll();
        setJobs(response.bookings || []);
      } catch (err) {
        setError(err.message || 'Failed to load work history');
      }
    };

    loadJobs();
  }, []);

  const completedJobs = useMemo(
    () => jobs
      .filter((job) => job.status === 'completed')
      .map((job) => ({
        id: job.id,
        service: job.service_name,
        customerName: job.customer_name,
        date: job.booking_date,
        address: job.address,
        status: job.status,
        servicePrice: parsePriceValue(job.service_price),
        income: parsePriceValue(job.service_price) * TECH_EARNING_RATE,
      })),
    [jobs]
  );

  const completedThisMonth = useMemo(() => {
    const now = new Date();
    return completedJobs.filter((job) => {
      if (!job.date) return false;
      const jobDate = parseJobDate(job.date);
      if (!jobDate) return false;
      return jobDate.getFullYear() === now.getFullYear()
        && jobDate.getMonth() === now.getMonth();
    }).length;
  }, [completedJobs]);

  const completionRate = useMemo(() => {
    if (jobs.length === 0) return 0;
    return Math.round((completedJobs.length / jobs.length) * 100);
  }, [completedJobs.length, jobs.length]);

  const totalIncome = useMemo(
    () => completedJobs.reduce((sum, job) => sum + job.income, 0),
    [completedJobs]
  );

  const incomeThisMonth = useMemo(() => {
    const now = new Date();
    return completedJobs.reduce((sum, job) => {
      if (!job.date) return sum;
      const jobDate = parseJobDate(job.date);
      if (!jobDate) return sum;
      if (jobDate.getFullYear() !== now.getFullYear() || jobDate.getMonth() !== now.getMonth()) {
        return sum;
      }
      return sum + job.income;
    }, 0);
  }, [completedJobs]);

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/technician/dashboard' },
    { label: 'Work History' },
  ];

  const columns = [
    {
      header: 'Job ID',
      accessor: 'id',
    },
    {
      header: 'Service',
      accessor: 'service',
    },
    {
      header: 'Customer',
      accessor: 'customerName',
    },
    {
      header: 'Date Completed',
      accessor: 'date',
    },
    {
      header: 'Address',
      render: (row) => (
        <span className="text-sm text-gray-600 truncate max-w-xs block">
          {row.address}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (row) => <Badge status={row.status} />,
    },
  ];

  return (
    <DashboardLayout
      userRole="technician"
      userName={currentUser?.fullName || 'Technician'}
      menuItems={TECHNICIAN_MENU}
    >
      <Breadcrumb items={breadcrumbItems} />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Work History
        </h1>
        <p className="text-gray-600">
          View your completed service jobs
        </p>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
          className="mb-6"
        />
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <h3 className="text-sm text-gray-600 mb-2">Total Completed</h3>
          <p className="text-3xl font-bold text-gray-900">
            {completedJobs.length}
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm text-gray-600 mb-2">This Month</h3>
          <p className="text-3xl font-bold text-gray-900">{completedThisMonth}</p>
        </div>
        <div className="card">
          <h3 className="text-sm text-gray-600 mb-2">Success Rate</h3>
          <p className="text-3xl font-bold text-green-600">{completionRate}%</p>
        </div>
        <div className="card">
          <h3 className="text-sm text-gray-600 mb-2">Income Earned</h3>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalIncome)}</p>
          <p className="text-xs text-gray-500 mt-1">This month: {formatCurrency(incomeThisMonth)}</p>
        </div>
      </div>

      {/* Work History Table */}
      <Table columns={columns} data={completedJobs} />
    </DashboardLayout>
  );
};

export default WorkHistory;
