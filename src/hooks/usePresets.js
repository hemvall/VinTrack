import { useState, useCallback, useEffect } from 'react';
import {
  fetchPresets,
  insertPreset,
  updatePreset as updatePresetDb,
  deletePreset as deletePresetDb,
} from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

export function usePresets(userId) {
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPresets(userId)
      .then((data) => { if (!cancelled) setPresets(data); })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [userId]);

  const addPreset = useCallback(
    async (preset) => {
      const temp = {
        id: uuidv4(),
        name: '',
        category: '',
        brand: '',
        size: '',
        buyPrice: 0,
        listPrice: 0,
        fees: 0,
        shippingCost: 0,
        listingTitle: '',
        listingDescription: '',
        notes: '',
        ...preset,
      };
      setPresets((prev) => [temp, ...prev]);
      try {
        const saved = await insertPreset(temp, userId);
        setPresets((prev) => prev.map((p) => (p.id === temp.id ? saved : p)));
        return saved;
      } catch (err) {
        console.error(err);
        setPresets((prev) => prev.filter((p) => p.id !== temp.id));
      }
    },
    [userId]
  );

  const updatePreset = useCallback(
    async (id, changes) => {
      setPresets((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)));
      try {
        await updatePresetDb(id, changes);
      } catch (err) {
        console.error(err);
        fetchPresets(userId).then(setPresets);
      }
    },
    [userId]
  );

  const deletePreset = useCallback(
    async (id) => {
      const backup = presets;
      setPresets((prev) => prev.filter((p) => p.id !== id));
      try {
        await deletePresetDb(id);
      } catch (err) {
        console.error(err);
        setPresets(backup);
      }
    },
    [presets, userId]
  );

  return { presets, loading, addPreset, updatePreset, deletePreset };
}
