import React, { useMemo } from 'react';
import { FiUsers, FiDollarSign, FiShoppingCart, FiFolder } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useData } from '../context/DataContext';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const calculateAge = (dob) => {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
};

const Dashboard = () => {
  const { users, orders } = useData();

  const revenueOrders = useMemo(
    () => orders.filter((order) => ['Confirmed', 'Completed'].includes(order.status)),
    [orders]
  );

  const totalRevenue = useMemo(
    () => revenueOrders.reduce((sum, order) => sum + (order.amount || 0), 0),
    [revenueOrders]
  );

  const averageAge = useMemo(() => {
    if (!users.length) return 0;
    const totalAge = users.reduce((sum, user) => sum + calculateAge(user.dob), 0);
    return Math.round(totalAge / users.length);
  }, [users]);

  const monthlyData = useMemo(() => {
    const monthMap = {};
    revenueOrders.forEach((order) => {
      const date = new Date(order.date);
      const month = date.getMonth();
      monthMap[month] = monthMap[month] || { revenue: 0, orders: 0 };
      monthMap[month].revenue += order.amount || 0;
      monthMap[month].orders += 1;
    });

    return monthNames.map((name, index) => ({
      name,
      sales: monthMap[index]?.revenue ?? 0,
      orders: monthMap[index]?.orders ?? 0,
    }));
  }, [revenueOrders]);

  const stats = [
    { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: <FiDollarSign />, color: 'bg-green-500', change: '+12%' },
    { title: 'Total Users', value: users.length, icon: <FiUsers />, color: 'bg-primary', change: '+5%' },
    { title: 'Total Orders', value: orders.length, icon: <FiShoppingCart />, color: 'bg-secondary', change: '+8%' },
    { title: 'Average Age', value: `${averageAge} yrs`, icon: <FiFolder />, color: 'bg-yellow-500', change: '+1%' },
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold text-dark mb-6">Dashboard</h2>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover transition flex items-center gap-4">
            <div className={`${stat.color} p-4 rounded-lg text-white text-2xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <h3 className="text-2xl font-bold text-dark">{stat.value}</h3>
              <p className="text-green-500 text-xs font-semibold">{stat.change} from last month</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-card">
          <h3 className="text-lg font-bold mb-4">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-card">
          <h3 className="text-lg font-bold mb-4">Monthly Orders</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#ec4899" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-6 rounded-xl shadow-card">
        <h3 className="text-lg font-bold mb-4">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">#{order.id}</td>
                  <td className="py-3 px-4">{order.user}</td>
                  <td className="py-3 px-4">{order.project}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'Confirmed' ? 'bg-green-100 text-green-600' : 
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 
                      'bg-red-100 text-red-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;