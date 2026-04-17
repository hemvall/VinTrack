import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Zap, Edit3, Trash2, Save, X, FileText, Image as ImageIcon, ExternalLink } from 'lucide-react';
import CustomSelect from './CustomSelect';

const CATEGORIES = [
  'Tops', 'Bottoms', 'Shoes', 'Outerwear', 'Accessories',
  'Bags', 'Sportswear', 'Dresses', 'Electronics', 'Home', 'Other',
];

const emptyPreset = {
  name: '',
  brand: '',
  category: '',
  size: '',
  buyPrice: '',
  listPrice: '',
  fees: '',
  shippingCost: '',
  listingTitle: '',
  listingDescription: '',
  imageUrl: '',
  sourceUrl: '',
  notes: '',
};

export default function PresetManager({ presets, addPreset, updatePreset, deletePreset }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyPreset);

  const startNew = () => {
    setForm(emptyPreset);
    setEditing('new');
  };

  const startEdit = (p) => {
    setForm({
      name: p.name || '',
      brand: p.brand || '',
      category: p.category || '',
      size: p.size || '',
      buyPrice: p.buyPrice || '',
      listPrice: p.listPrice || '',
      fees: p.fees || '',
      shippingCost: p.shippingCost || '',
      listingTitle: p.listingTitle || '',
      listingDescription: p.listingDescription || '',
      imageUrl: p.imageUrl || '',
      sourceUrl: p.sourceUrl || '',
      notes: p.notes || '',
    });
    setEditing(p.id);
  };

  const cancel = () => {
    setEditing(null);
    setForm(emptyPreset);
  };

  const save = () => {
    const data = {
      ...form,
      buyPrice: parseFloat(form.buyPrice) || 0,
      listPrice: parseFloat(form.listPrice) || 0,
      fees: parseFloat(form.fees) || 0,
      shippingCost: parseFloat(form.shippingCost) || 0,
    };
    if (editing === 'new') addPreset(data);
    else updatePreset(editing, data);
    cancel();
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const hasListing = (p) => !!(p.listingTitle || p.listingDescription);

  return (
    <div className="presets-section">
      <motion.div
        className="section-header"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h2 className="section-title">
          <Zap size={24} /> Presets
        </h2>
        <button className="btn btn-primary btn-glow" onClick={startNew}>
          <Plus size={16} /> New Preset
        </button>
      </motion.div>

      <motion.p
        className="section-desc"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Save templates for items you sell often. Pre-write your Vinted listing so you can publish instantly when items arrive.
      </motion.p>

      <AnimatePresence>
        {editing !== null && (
          <motion.div
            className="preset-form-card"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          >
            <div className="form-row">
              <div className="form-group flex-2">
                <label>Preset Name</label>
                <input value={form.name} onChange={set('name')} required placeholder="e.g. Nike Dunk Low" />
              </div>
              <div className="form-group">
                <label>Brand</label>
                <input value={form.brand} onChange={set('brand')} placeholder="Brand" />
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
                <input value={form.size} onChange={set('size')} placeholder="Size" />
              </div>
              <div className="form-group">
                <label>Buy Price (EUR)</label>
                <input type="number" step="0.01" min="0" value={form.buyPrice} onChange={set('buyPrice')} />
              </div>
              <div className="form-group">
                <label>List Price (EUR)</label>
                <input type="number" step="0.01" min="0" value={form.listPrice} onChange={set('listPrice')} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Fees (EUR)</label>
                <input type="number" step="0.01" min="0" value={form.fees} onChange={set('fees')} />
              </div>
              <div className="form-group">
                <label>Shipping (EUR)</label>
                <input type="number" step="0.01" min="0" value={form.shippingCost} onChange={set('shippingCost')} />
              </div>
            </div>

            <div className="form-divider">
              <FileText size={14} />
              <span>Vinted Listing Template</span>
            </div>

            <div className="form-group">
              <label>Listing Title</label>
              <input value={form.listingTitle} onChange={set('listingTitle')} placeholder="e.g. Nike Dunk Low - Neuf - Taille 42" />
            </div>
            <div className="form-group" style={{ marginTop: 10 }}>
              <label>Listing Description</label>
              <textarea
                value={form.listingDescription}
                onChange={set('listingDescription')}
                rows={3}
                placeholder={"Pre-write your Vinted description...\nCondition, sizing, details..."}
              />
            </div>
            <div className="form-divider">
              <ImageIcon size={14} />
              <span>Image & Source</span>
            </div>

            <div className="form-row">
              <div className="form-group flex-2">
                <label>Image URL / Path</label>
                <input
                  value={form.imageUrl}
                  onChange={set('imageUrl')}
                  placeholder="https://... or /path/to/image.jpg"
                />
              </div>
              <div className="form-group flex-2">
                <label>Source URL (where you buy it)</label>
                <input
                  value={form.sourceUrl}
                  onChange={set('sourceUrl')}
                  placeholder="https://vinted.com/..."
                />
              </div>
            </div>

            {form.imageUrl && (
              <div className="image-preview">
                <img
                  src={form.imageUrl}
                  alt="preview"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  onLoad={(e) => { e.currentTarget.style.display = 'block'; }}
                />
              </div>
            )}

            <div className="form-group" style={{ marginTop: 10 }}>
              <label>Notes</label>
              <input value={form.notes} onChange={set('notes')} placeholder="Internal notes..." />
            </div>

            <div className="form-actions">
              <button className="btn btn-ghost" onClick={cancel}><X size={16} /> Cancel</button>
              <button className="btn btn-primary btn-glow" onClick={save}><Save size={16} /> Save Preset</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="presets-grid">
        <AnimatePresence>
          {presets.map((p, i) => (
            <motion.div
              key={p.id}
              className="preset-card"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ delay: i * 0.05 }}
              layout
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="preset-card-header">
                <h4>{p.name || 'Unnamed'}</h4>
                <div className="preset-card-actions">
                  {p.sourceUrl && (
                    <a
                      className="btn-icon small"
                      href={p.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      title="Open source"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                  <button className="btn-icon small" onClick={() => startEdit(p)}><Edit3 size={14} /></button>
                  <button className="btn-icon small danger" onClick={() => deletePreset(p.id)}><Trash2 size={14} /></button>
                </div>
              </div>
              {p.imageUrl && (
                <div className="preset-thumb">
                  <img
                    src={p.imageUrl}
                    alt={p.name || 'preset'}
                    onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
                  />
                </div>
              )}
              <div className="preset-card-details">
                {p.brand && <span className="tag">{p.brand}</span>}
                {p.category && <span className="tag">{p.category}</span>}
                {p.size && <span className="tag">Size {p.size}</span>}
                {hasListing(p) && <span className="tag tag-listing"><FileText size={10} /> Listing ready</span>}
              </div>
              <div className="preset-card-prices">
                {p.buyPrice > 0 && <span>Buy: {p.buyPrice}EUR</span>}
                {p.listPrice > 0 && <span>List: {p.listPrice}EUR</span>}
                {p.fees > 0 && <span>Fees: {p.fees}EUR</span>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {presets.length === 0 && editing === null && (
          <motion.div
            className="empty-state small"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Zap size={32} strokeWidth={1.2} />
            <p>No presets yet — create one to speed up adding recurring items.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
