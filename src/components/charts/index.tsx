'use client';

import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// Framework Progress Line Chart (like Vanta)
const frameworkProgressData = [
  { month: 'Jul', 'SOC 2': 45, 'ISO 27001': 40, 'GDPR': 50, 'HIPAA': 35, 'NIST': 30 },
  { month: 'Aug', 'SOC 2': 52, 'ISO 27001': 48, 'GDPR': 55, 'HIPAA': 42, 'NIST': 38 },
  { month: 'Sep', 'SOC 2': 60, 'ISO 27001': 55, 'GDPR': 62, 'HIPAA': 50, 'NIST': 45 },
  { month: 'Oct', 'SOC 2': 68, 'ISO 27001': 65, 'GDPR': 70, 'HIPAA': 58, 'NIST': 52 },
  { month: 'Nov', 'SOC 2': 75, 'ISO 27001': 72, 'GDPR': 78, 'HIPAA': 65, 'NIST': 60 },
  { month: 'Dec', 'SOC 2': 82, 'ISO 27001': 80, 'GDPR': 85, 'HIPAA': 72, 'NIST': 68 },
];

export function FrameworkProgressChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={frameworkProgressData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <Tooltip 
          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
        />
        <Legend />
        <Line type="monotone" dataKey="SOC 2" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="ISO 27001" stroke="#ec4899" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
        <Line type="monotone" dataKey="GDPR" stroke="#14b8a6" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 3 }} />
        <Line type="monotone" dataKey="HIPAA" stroke="#3b82f6" strokeWidth={2} strokeDasharray="8 4" dot={{ r: 3 }} />
        <Line type="monotone" dataKey="NIST" stroke="#f59e0b" strokeWidth={2} strokeDasharray="2 2" dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Upcoming Audits Horizontal Bar Chart
const upcomingAuditsData = [
  { name: 'SOC 2', progress: 85, color: '#7c3aed' },
  { name: 'ISO 27001:2022', progress: 72, color: '#3b82f6' },
  { name: 'HIPAA', progress: 45, color: '#22c55e' },
  { name: 'GDPR', progress: 60, color: '#f59e0b' },
];

export function UpcomingAuditsChart() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 text-xs text-gray-500">
        <span>Today</span>
        <span>Aug</span>
        <span>Sep</span>
        <span>Oct</span>
      </div>
      {upcomingAuditsData.map((audit) => (
        <div key={audit.name} className="flex items-center gap-3">
          <span className="text-sm w-28 text-gray-600">{audit.name}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all"
              style={{ width: `${audit.progress}%`, backgroundColor: audit.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Inherent Risk Stacked Bar Chart
const riskData = [
  { name: 'Q1', Critical: 12, High: 25, Medium: 35, Low: 15 },
  { name: 'Q2', Critical: 8, High: 22, Medium: 40, Low: 18 },
  { name: 'Q3', Critical: 15, High: 28, Medium: 32, Low: 12 },
  { name: 'Q4', Critical: 10, High: 20, Medium: 38, Low: 20 },
  { name: 'Q5', Critical: 18, High: 30, Medium: 28, Low: 14 },
  { name: 'Q6', Critical: 6, High: 18, Medium: 42, Low: 22 },
];

export function InherentRiskChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={riskData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
        <Legend />
        <Bar dataKey="Critical" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
        <Bar dataKey="High" stackId="a" fill="#f97316" />
        <Bar dataKey="Medium" stackId="a" fill="#fbbf24" />
        <Bar dataKey="Low" stackId="a" fill="#22c55e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Assigned Controls Stacked Bar
const controlsData = [
  { name: 'IT', Assigned: 45, Unassigned: 12 },
  { name: 'HR', Assigned: 32, Unassigned: 8 },
  { name: 'Finance', Assigned: 28, Unassigned: 15 },
  { name: 'Legal', Assigned: 22, Unassigned: 6 },
  { name: 'Ops', Assigned: 38, Unassigned: 10 },
];

export function AssignedControlsChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={controlsData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
        <Legend />
        <Bar dataKey="Assigned" stackId="a" fill="#3b82f6" />
        <Bar dataKey="Unassigned" stackId="a" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Tests Passing Line Chart
const testPassingData = [
  { month: 'Jul', HR: 52, IT: 48, Policy: 55, Engineering: 60, Risks: 45 },
  { month: 'Aug', HR: 58, IT: 55, Policy: 62, Engineering: 65, Risks: 52 },
  { month: 'Sep', HR: 65, IT: 62, Policy: 70, Engineering: 72, Risks: 60 },
  { month: 'Oct', HR: 72, IT: 70, Policy: 78, Engineering: 80, Risks: 68 },
  { month: 'Nov', HR: 78, IT: 75, Policy: 82, Engineering: 85, Risks: 75 },
  { month: 'Dec', HR: 85, IT: 82, Policy: 88, Engineering: 92, Risks: 80 },
];

export function TestsPassingChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={testPassingData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" domain={[0, 100]} />
        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
        <Legend />
        <Line type="monotone" dataKey="HR" stroke="#7c3aed" strokeWidth={2} />
        <Line type="monotone" dataKey="IT" stroke="#ef4444" strokeWidth={2} />
        <Line type="monotone" dataKey="Policy" stroke="#ec4899" strokeWidth={2} />
        <Line type="monotone" dataKey="Engineering" stroke="#3b82f6" strokeWidth={2} />
        <Line type="monotone" dataKey="Risks" stroke="#22c55e" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}

