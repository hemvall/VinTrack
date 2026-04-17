import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Zap, Sparkles, Copy, Check, FileText } from 'lucide-react';
import CustomSelect from './CustomSelect';

const CATEGORIES = [
  'Tops', 'Bottoms', 'Shoes', 'Outerwear', 'Accessories',
  'Bags', 'Sportswear', 'Dresses', 'Electronics', 'Home', 'Other',
];

const STATUSES = [
  { value: 'unlisted', label: 'Unlisted', color: '#e8a838' },
  { value: 'listed', label: 'Listed', color: '#7850dc' },
  { value: 'sold', label: 'Sold', color: '#45d96a' },
];

const emptyForm = {
  title: '',
  brand: '',
  size: '',
  category: '',
  status: 'unlisted',
  buyPrice: '',
  listPrice: '',
  soldPrice: '',
  soldDate: '',
  fees: '',
  shippingCost: '',
  listingTitle: '',
  listingDescription: '',
  notes: '',
};

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button type="button" className="btn-copy" onClick={handleCopy} title="Copy">
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Check size={13} />
          </motion.span>
        ) : (
          <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Copy size={13} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export default function ArticleModal({ open, onClose, onSave, article, presets }) {
  const [form, setForm] = useState(emptyForm);
  const [showPresets, setShowPresets] = useState(false);

  useEffect(() => {
    if (article) {
      setForm({
        ...emptyForm,
        ...article,
        buyPrice: article.buyPrice || '',
        listPrice: article.listPrice || '',
        soldPrice: article.soldPrice || '',
        fees: article.fees || '',
        shippingCost: article.shippingCost || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [article, open]);

  const set = (key) => (e) => {
    const val = e.target.value;
    const next = { ...form, [key]: val };

    if (key === 'soldPrice' || key === 'listPrice') {
      const soldVal = key === 'soldPrice' ? val : next.soldPrice;
      const listVal = key === 'listPrice' ? val : next.listPrice;
      if (parseFloat(soldVal) > 0) {
        next.status = 'sold';
      } else if (parseFloat(listVal) > 0) {
        next.status = 'listed';
      } else {
        next.status = 'unlisted';
      }
    }

    setForm(next);
  };

  const applyPreset = (preset) => {
    setForm({
      ...form,
      title: preset.name || form.title,
      category: preset.category || form.category,
      brand: preset.brand || form.brand,
      size: preset.size || form.size,
      buyPrice: preset.buyPrice || form.buyPrice,
      listPrice: preset.listPrice || form.listPrice,
      fees: preset.fees || form.fees,
      shippingCost: preset.shippingCost || form.shippingCost,
      listingTitle: preset.listingTitle || form.listingTitle,
      listingDescription: preset.listingDescription || form.listingDescription,
      notes: preset.notes || form.notes,
    });
    setShowPresets(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      buyPrice: parseFloat(form.buyPrice) || 0,
      listPrice: parseFloat(form.listPrice) || 0,
      soldPrice: parseFloat(form.soldPrice) || 0,
      fees: parseFloat(form.fees) || 0,
      shippingCost: parseFloat(form.shippingCost) || 0,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal"
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 40 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                <Sparkles size={18} className="modal-header-icon" />
                {article ? 'Edit Article' : 'New Article'}
              </h3>
              <div className="modal-header-actions">
                {presets && presets.length > 0 && !article && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-glow"
                    onClick={() => setShowPresets(!showPresets)}
                  >
                    <Zap size={16} /> Preset
                  </button>
                )}
                <button className="btn-icon" onClick={onClose}>
                  <X size={20} />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showPresets && (
                <motion.div
                  className="preset-dropdown"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {presets.map((p, i) => (
                    <motion.button
                      key={p.id}
                      className="preset-item"
                      onClick={() => applyPreset(p)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <span className="preset-item-name">
                        <Zap size={12} className="preset-item-zap" /> {p.name}
                      </span>
                      <span className="preset-item-detail">
                        {p.brand} {p.category && `· ${p.category}`}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              {/* ---- Item info ---- */}
              <div className="form-row">
                <div className="form-group flex-2">
                  <label>Title</label>
                  <input value={form.title} onChange={set('title')} required placeholder="e.g. Nike Air Max 90" />
                </div>
                <div className="form-group">
                  <label>Brand</label>
                  <input value={form.brand} onChange={set('brand')} placeholder="e.g. Nike" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <CustomSelect
                    value={form.category}
                    onChange={set('category')}
                    options={CATEGORIES}
                    placeholder="Select category..."
                  />
                </div>
                <div className="form-group">
                  <label>Size</label>
                  <input value={form.size} onChange={set('size')} placeholder="e.g. 42, M, OS" />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <CustomSelect
                    value={form.status}
                    onChange={set('status')}
                    options={STATUSES}
                    placeholder="Select status..."
                  />
                </div>
              </div>

              {/* ---- Prices ---- */}
              <div className="form-row">
                <div className="form-group">
                  <label>Buy Price (EUR)</label>
                  <input type="number" step="0.01" min="0" value={form.buyPrice} onChange={set('buyPrice')} placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label>List Price (EUR)</label>
                  <input type="number" step="0.01" min="0" value={form.listPrice} onChange={set('listPrice')} placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label>Sold Price (EUR)</label>
                  <input type="number" step="0.01" min="0" value={form.soldPrice} onChange={set('soldPrice')} placeholder="0.00" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fees (EUR)</label>
                  <input type="number" step="0.01" min="0" value={form.fees} onChange={set('fees')} placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label>Shipping (EUR)</label>
                  <input type="number" step="0.01" min="0" value={form.shippingCost} onChange={set('shippingCost')} placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label>Sold Date</label>
                  <input type="date" value={form.soldDate} onChange={set('soldDate')} />
                </div>
              </div>

              {/* ---- Listing section ---- */}
              <div className="form-divider">
                <FileText size={14} />
                <span>Vinted Listing</span>
              </div>

              <div className="form-group">
                <div className="label-row">
                  <label>Listing Title</label>
                  <CopyBtn text={form.listingTitle} />
                </div>
                <input
                  value={form.listingTitle}
                  onChange={set('listingTitle')}
                  placeholder="e.g. Nike Air Max 90 - Taille 42 - Neuf"
                />
              </div>

              <div className="form-group" style={{ marginTop: 10 }}>
                <div className="label-row">
                  <label>Listing Description</label>
                  <CopyBtn text={form.listingDescription} />
                </div>
                <textarea
                  value={form.listingDescription}
                  onChange={set('listingDescription')}
                  rows={4}
                  placeholder={"Write your Vinted listing description here...\nCondition, defects, sizing info, etc."}
                />
              </div>

              {/* ---- Notes ---- */}
              <div className="form-group" style={{ marginTop: 10 }}>
                <label>Notes (internal)</label>
                <textarea value={form.notes} onChange={set('notes')} rows={2} placeholder="Personal notes, not visible on listing..." />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-glow">
                  <Save size={16} /> {article ? 'Update' : 'Add Article'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
