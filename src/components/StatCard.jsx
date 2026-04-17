import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, sub, color = '#0fb9b1', delay = 0 }) {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 200 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      <div className="stat-card-glow" style={{ background: color }} />
      <div className="stat-icon" style={{ background: `${color}18`, color, boxShadow: `0 0 20px ${color}15` }}>
        <Icon size={22} />
      </div>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {sub && <span className="stat-sub">{sub}</span>}
      </div>
    </motion.div>
  );
}
