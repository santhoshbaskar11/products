import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { Truck, DollarSign, Users, Award, ShoppingBag, MessageSquare, ClipboardList, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { products, orders, reviews, customers, contactMessages, customOrders } = useContext(ShopContext);

  // Compute stats
  const totalSales = orders.reduce((sum, o) => sum + o.amount, 0);
  const pendingOrders = orders.filter((o) => o.status === 'Processing').length;
  const ratingAvg = reviews.length 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const stats = [
    {
      title: 'Total Sales Revenue',
      value: `$${totalSales.toFixed(2)}`,
      sub: `${orders.length} standard order(s)`,
      icon: DollarSign,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Active Catalog Items',
      value: products.length,
      sub: 'Beard, Hair, Skincare items',
      icon: ShoppingBag,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'Registered Customers',
      value: customers.length,
      sub: 'Active client accounts',
      icon: Users,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20'
    },
    {
      title: 'Feedback Score',
      value: `${ratingAvg} / 5`,
      sub: `From ${reviews.length} total reviews`,
      icon: Award,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Contact Messages',
      value: contactMessages.length,
      sub: `${contactMessages.filter(m => m.unread).length} unread message(s)`,
      icon: MessageSquare,
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
    },
    {
      title: 'Custom Grooming Orders',
      value: customOrders.length,
      sub: `${customOrders.filter(o => o.status === 'Processing').length} pending kits`,
      icon: ClipboardList,
      color: 'text-[#C9A84C] bg-[#C9A84C]/10 border-[#C9A84C]/20'
    }
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-white font-serif tracking-wide">Admin Dashboard</h2>
        <p className="text-xs text-zinc-400 font-light mt-1">Sovereign Store real-time stats overview and operations hub.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item, idx) => (
          <div key={idx} className="bg-zinc-900/35 border border-white/5 p-6 rounded-3xl backdrop-blur-md flex items-center justify-between shadow-lg">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">{item.title}</span>
              <span className="text-2xl font-bold text-white font-serif">{item.value}</span>
              <span className="text-[10px] text-zinc-400 block">{item.sub}</span>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Grid: Charts Mock & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Card: Chart Mock (7 Cols) */}
        <div className="lg:col-span-7 bg-zinc-950 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-base font-bold text-white font-serif tracking-wide">Monthly Sales Performance</h4>
              <span className="text-[10px] text-zinc-500 block">Visual revenue projections (June 2026)</span>
            </div>
            <TrendingUp className="h-5 w-5 text-[#C9A84C]" />
          </div>
          
          {/* Mock Visual Graph (bar grid heights) */}
          <div className="h-48 flex items-end gap-3 md:gap-5 border-b border-white/10 pb-4">
            {[45, 60, 52, 78, 88, 95].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div
                  className="w-full bg-gradient-to-t from-[#C9A84C]/60 to-[#E8C97E] rounded-lg transition-all duration-500 hover:brightness-110 relative"
                  style={{ height: `${val}%` }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] text-[#E8C97E] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    ${val * 12}
                  </span>
                </div>
                <span className="text-[9px] text-zinc-500 uppercase font-medium">Month {i+1}</span>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-zinc-500 font-light mt-4">
            Sales volume increased by <strong className="text-green-500 font-semibold">14.2%</strong> compared to previous quarter due to premium custom kit configurations.
          </p>
        </div>

        {/* Right Card: Activity Feed (5 Cols) */}
        <div className="lg:col-span-5 bg-zinc-950 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
          <h4 className="text-base font-bold text-white font-serif tracking-wide">Recent Operations</h4>
          
          <div className="space-y-4">
            <h5 className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-wider">Standard Orders</h5>
            {orders.slice(0, 2).map((order) => (
              <div key={order.id} className="flex items-center gap-3 text-xs border-b border-white/5 pb-3">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <div className="flex-1">
                  <p className="text-white font-semibold">{order.customer} placed order</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Order: {order.id} • Total ${order.amount.toFixed(2)}</p>
                </div>
                <span className="text-[10px] text-[#E8C97E] font-medium">{order.date}</span>
              </div>
            ))}

            <h5 className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-wider pt-2">Custom Kit Orders</h5>
            {customOrders.slice(0, 2).map((order) => (
              <div key={order.id} className="flex items-center gap-3 text-xs border-b border-white/5 pb-3">
                <div className="h-2 w-2 rounded-full bg-[#C9A84C]"></div>
                <div className="flex-1">
                  <p className="text-white font-semibold">{order.customer} ordered custom kit</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Notes: "{order.notes || 'None'}" • Brand: {order.brand}</p>
                </div>
                <span className="text-[10px] text-[#E8C97E] font-medium">{order.date}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
