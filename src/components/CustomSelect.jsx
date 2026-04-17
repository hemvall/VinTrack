import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ value, onChange, options, placeholder = 'Select...' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => (typeof o === 'string' ? o : o.value) === value);
  const label = selected
    ? typeof selected === 'string'
      ? selected
      : selected.label
    : null;

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (opt) => {
    const val = typeof opt === 'string' ? opt : opt.value;
    onChange({ target: { value: val } });
    setOpen(false);
  };

  return (
    <div className="custom-select" ref={ref}>
      <button
        type="button"
        className={`custom-select-trigger ${open ? 'open' : ''} ${value ? 'has-value' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span className={`custom-select-label ${!label ? 'placeholder' : ''}`}>
          {label || placeholder}
        </span>
        <motion.span
          className="custom-select-chevron"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={15} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="custom-select-dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="custom-select-options">
              {options.map((opt, i) => {
                const optVal = typeof opt === 'string' ? opt : opt.value;
                const optLabel = typeof opt === 'string' ? opt : opt.label;
                const optColor = typeof opt === 'object' ? opt.color : null;
                const isActive = optVal === value;

                return (
                  <motion.button
                    key={optVal}
                    type="button"
                    className={`custom-select-option ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelect(opt)}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15, delay: i * 0.02 }}
                  >
                    {optColor && (
                      <span className="custom-select-dot" style={{ background: optColor }} />
                    )}
                    <span className="custom-select-option-label">{optLabel}</span>
                    {isActive && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="custom-select-check"
                      >
                        <Check size={14} />
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
