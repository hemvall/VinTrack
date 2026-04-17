import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Filter,
  Package,
  ArrowUpDown,
  FileText,
  Tag,
} from 'lucide-react';
import ArticleModal from './ArticleModal';

function fmt(n) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);
}

const STATUS_BADGE = {
  unlisted: { label: 'Unlisted', color: '#e8a838' },
  listed: { label: 'Listed', color: '#7850dc' },
  sold: { label: 'Sold', color: '#45d96a' },
};

export default function ArticleList({ articles, addArticle, updateArticle, deleteArticle, presets }) {
  const [modal, setModal] = useState({ open: false, article: null });
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [selected, setSelected] = useState(() => new Set());

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  const markSelectedAsListed = async () => {
    const ids = [...selected];
    await Promise.all(
      ids
        .map((id) => articles.find((a) => a.id === id))
        .filter((a) => a && a.status === 'unlisted')
        .map((a) => updateArticle(a.id, { status: 'listed' }))
    );
    clearSelection();
  };

  const filtered = articles
    .filter((a) => {
      if (filterStatus !== 'all' && a.status !== filterStatus) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          (a.title || '').toLowerCase().includes(q) ||
          (a.brand || '').toLowerCase().includes(q) ||
          (a.category || '').toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (typeof va === 'string') { va = va.toLowerCase(); vb = (vb || '').toLowerCase(); }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const profit = (a) =>
    a.status === 'sold'
      ? (a.soldPrice || 0) - (a.buyPrice || 0) - (a.fees || 0) - (a.shippingCost || 0)
      : null;

  const selectableIds = filtered.map((a) => a.id);
  const allSelected = selectableIds.length > 0 && selectableIds.every((id) => selected.has(id));
  const toggleSelectAll = () => {
    if (allSelected) clearSelection();
    else setSelected(new Set(selectableIds));
  };

  const selectedUnlistedCount = [...selected]
    .map((id) => articles.find((a) => a.id === id))
    .filter((a) => a && a.status === 'unlisted').length;

  return (
    <div className="articles-section">
      <motion.div
        className="section-header"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <h2 className="section-title">
          <Package size={24} /> Articles ({articles.length})
        </h2>
        <button className="btn btn-primary btn-glow" onClick={() => setModal({ open: true, article: null })}>
          <Plus size={16} /> New Article
        </button>
      </motion.div>

      <motion.div
        className="toolbar"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="search-box">
          <Search size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
          />
        </div>
        <div className="filter-group">
          <Filter size={14} />
          {['all', 'unlisted', 'listed', 'sold'].map((s) => {
            const isActive = filterStatus === s;
            return (
              <motion.button
                key={s}
                className={`filter-btn ${isActive ? 'active' : ''}`}
                onClick={() => setFilterStatus(s)}
                whileTap={{ scale: 0.95 }}
                animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 0.25 }}
              >
                {s !== 'all' && (
                  <span className="filter-dot" style={{ background: STATUS_BADGE[s].color }} />
                )}
                {s === 'all' ? 'All' : STATUS_BADGE[s].label}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            className="bulk-action-bar"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <span className="bulk-count">{selected.size} selected</span>
            <div className="bulk-actions">
              <button
                type="button"
                className="btn btn-primary btn-glow"
                onClick={markSelectedAsListed}
                disabled={selectedUnlistedCount === 0}
                title={selectedUnlistedCount === 0 ? 'No unlisted items in selection' : ''}
              >
                <Tag size={14} /> Mark as Listed
                {selectedUnlistedCount > 0 && selectedUnlistedCount !== selected.size && (
                  <span className="bulk-sub"> ({selectedUnlistedCount})</span>
                )}
              </button>
              <button type="button" className="btn btn-ghost" onClick={clearSelection}>
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="table-wrapper"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <table className="articles-table">
          <thead>
            <tr>
              <th className="checkbox-cell">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </th>
              <th onClick={() => toggleSort('title')}>
                Title <ArrowUpDown size={12} />
              </th>
              <th onClick={() => toggleSort('brand')}>Brand</th>
              <th>Cat.</th>
              <th>Size</th>
              <th onClick={() => toggleSort('status')}>Status</th>
              <th onClick={() => toggleSort('buyPrice')}>Buy</th>
              <th onClick={() => toggleSort('listPrice')}>List</th>
              <th onClick={() => toggleSort('soldPrice')}>Sold</th>
              <th>Profit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((a, i) => {
                const p = profit(a);
                const badge = STATUS_BADGE[a.status];
                return (
                  <motion.tr
                    key={a.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12, transition: { duration: 0.15 } }}
                    transition={{ delay: i * 0.03 }}
                    layout
                    className={selected.has(a.id) ? 'row-selected' : ''}
                  >
                    <td className="checkbox-cell">
                      <input
                        type="checkbox"
                        checked={selected.has(a.id)}
                        onChange={() => toggleSelect(a.id)}
                        aria-label={`Select ${a.title}`}
                      />
                    </td>
                    <td className="title-cell">
                      <span>{a.title}</span>
                      {(a.listingTitle || a.listingDescription) && (
                        <span className="listing-badge" title="Listing ready"><FileText size={11} /></span>
                      )}
                    </td>
                    <td>{a.brand}</td>
                    <td>{a.category}</td>
                    <td>{a.size}</td>
                    <td>
                      <span className="status-badge" style={{ background: `${badge.color}15`, color: badge.color, boxShadow: `0 0 12px ${badge.color}10` }}>
                        <span className="status-dot" style={{ background: badge.color }} />
                        {badge.label}
                      </span>
                    </td>
                    <td>{fmt(a.buyPrice)}</td>
                    <td>{fmt(a.listPrice)}</td>
                    <td>{a.status === 'sold' ? fmt(a.soldPrice) : <span className="text-dim">—</span>}</td>
                    <td>
                      {p !== null ? (
                        <span className={`profit-cell ${p >= 0 ? 'positive' : 'negative'}`}>
                          {p >= 0 ? '+' : ''}{fmt(p)}
                        </span>
                      ) : <span className="text-dim">—</span>}
                    </td>
                    <td className="actions-cell">
                      <button className="btn-icon small" onClick={() => setModal({ open: true, article: a })}>
                        <Edit3 size={14} />
                      </button>
                      <button className="btn-icon small danger" onClick={() => deleteArticle(a.id)}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-table">
            <Package size={28} strokeWidth={1.2} />
            <p>No articles found</p>
          </div>
        )}
      </motion.div>

      <ArticleModal
        open={modal.open}
        article={modal.article}
        presets={presets}
        onClose={() => setModal({ open: false, article: null })}
        onSave={(data) => {
          if (modal.article) updateArticle(modal.article.id, data);
          else addArticle(data);
        }}
      />
    </div>
  );
}
