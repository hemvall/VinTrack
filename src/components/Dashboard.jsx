import { motion } from 'framer-motion';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Package,
  BarChart3,
  Percent,
  Wallet,
  Tag,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import StatCard from './StatCard';
import { computeStats, getProfitOverTime, getCategoryBreakdown } from '../utils/stats';

const PIE_COLORS = ['#0fb9b1', '#2d78c8', '#7850dc', '#c83c96', '#e8a838', '#45d96a'];

function fmt(n) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);
}

export default function Dashboard({ articles }) {
  const stats = computeStats(articles);
  const profitData = getProfitOverTime(articles);
  const categoryData = getCategoryBreakdown(articles);

  return (
    <div className="dashboard">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <BarChart3 size={24} /> Dashboard
      </motion.h2>

      <div className="stats-grid">
        <StatCard icon={DollarSign} label="Total Profit" value={fmt(stats.totalProfit)} color="#45d96a" delay={0} />
        <StatCard icon={TrendingUp} label="Revenue" value={fmt(stats.totalRevenue)} color="#0fb9b1" delay={0.05} />
        <StatCard icon={ShoppingBag} label="Items Sold" value={stats.soldCount} color="#2d78c8" delay={0.1} />
        <StatCard icon={Package} label="Listed" value={stats.listedCount} sub={`${fmt(stats.potentialRevenue)} potential`} color="#7850dc" delay={0.15} />
        <StatCard icon={Tag} label="Unlisted" value={stats.unlistedCount} color="#e8a838" delay={0.2} />
        <StatCard icon={Wallet} label="Inventory Cost" value={fmt(stats.inventoryValue)} color="#c83c96" delay={0.25} />
        <StatCard icon={Percent} label="Avg Margin" value={`${stats.avgMargin}%`} color="#0fb9b1" delay={0.3} />
        <StatCard icon={DollarSign} label="Total Fees" value={fmt(stats.totalFees + stats.totalShipping)} color="#e85050" delay={0.35} />
      </div>

      <div className="charts-row">
        {profitData.length > 0 && (
          <motion.div
            className="chart-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
          >
            <h3>Profit Over Time</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={profitData}>
                <defs>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0fb9b1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0fb9b1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7850dc" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#7850dc" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="month" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#555" fontSize={12} tickFormatter={(v) => `${v}EUR`} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: 'rgba(20,20,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, backdropFilter: 'blur(12px)' }}
                  labelStyle={{ color: '#aaa', marginBottom: 4 }}
                  formatter={(v) => fmt(v)}
                  cursor={{ stroke: '#ffffff15' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#7850dc" fill="url(#revenueGrad)" strokeWidth={2.5} name="Revenue" />
                <Area type="monotone" dataKey="profit" stroke="#0fb9b1" fill="url(#profitGrad)" strokeWidth={2.5} name="Profit" dot={{ r: 3, fill: '#0fb9b1' }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {categoryData.length > 0 && (
          <motion.div
            className="chart-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 150 }}
          >
            <h3>Profit by Category</h3>
            <div className="pie-wrapper">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="profit"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                    paddingAngle={3}
                    label={({ name, profit }) => `${name} ${fmt(profit)}`}
                  >
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'rgba(20,20,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                    formatter={(v) => fmt(v)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </div>

      {articles.length === 0 && (
        <motion.div
          className="empty-state"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="empty-state-icon">
            <Package size={48} strokeWidth={1.2} />
          </div>
          <p>No articles yet — add your first item to start tracking!</p>
        </motion.div>
      )}
    </div>
  );
}
