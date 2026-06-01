import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useData } from '../context/DataContext';

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#22c55e', '#8b5cf6', '#14b8a6'];

const Reports = () => {
  const { orders, projectMap } = useData();

  const monthlyRevenue = useMemo(() => {
    const monthMap = {};
    orders.forEach((order) => {
      const date = new Date(order.date);
      const month = date.toLocaleString('default', { month: 'short' });
      monthMap[month] = (monthMap[month] || 0) + (order.amount || 0);
    });
    return Object.entries(monthMap).map(([name, sales]) => ({ name, sales }));
  }, [orders]);

  const categoryData = useMemo(() => {
    const counts = orders.reduce((acc, order) => {
      const project = projectMap[order.project];
      const category = project?.category || 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [orders, projectMap]);

  return (
    <section>
      <h2 className="text-2xl font-bold text-dark mb-6">Reports & Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Growth Chart */}
        <div className="bg-white p-6 rounded-xl shadow-card">
          <h3 className="text-lg font-bold mb-4">Revenue Growth</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-card">
          <h3 className="text-lg font-bold mb-4">Project Categories</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default Reports;