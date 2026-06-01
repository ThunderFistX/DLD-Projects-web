import React, { useState } from 'react';
import { useData } from '../context/DataContext';

const Orders = () => {
  const { orders, setOrders } = useData();
  const [filter, setFilter] = useState('All');

  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  const updateStatus = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const tabs = ['All', 'Pending', 'Confirmed', 'Cancelled'];

  return (
    <section>
      <h2 className="text-2xl font-bold text-dark mb-6">Order Management</h2>
      
      {/* Tabs Component */}
      <div className="flex gap-2 mb-6 bg-white p-1 rounded-lg shadow-card w-fit">
        {tabs.map(tab => (
          <button 
            key={tab} 
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-md transition font-semibold ${filter === tab ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-xl shadow-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-dark">#{order.id}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  order.status === 'Confirmed' ? 'bg-green-100 text-green-600' : 
                  order.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 
                  'bg-red-100 text-red-600'
                }`}>
                  {order.status}
                </span>
              </div>
              <p className="text-gray-500"><span className="font-semibold text-dark">{order.user}</span> ordered <span className="font-semibold text-dark">{order.project}</span></p>
              <p className="text-sm text-gray-400 mt-1">Date: {order.date} | Amount: <span className="text-primary font-bold">${order.amount}</span></p>
            </div>
            
            {order.status === 'Pending' && (
              <div className="flex gap-2">
                <button onClick={() => updateStatus(order.id, 'Confirmed')} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition">Confirm</button>
                <button onClick={() => updateStatus(order.id, 'Cancelled')} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition">Cancel</button>
              </div>
            )}
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-10 text-gray-400">No orders found for this filter.</div>
        )}
      </div>
    </section>
  );
};

export default Orders;