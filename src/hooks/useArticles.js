import { useState, useCallback, useEffect } from 'react';
import {
  fetchArticles,
  insertArticle,
  updateArticle as updateArticleDb,
  deleteArticle as deleteArticleDb,
} from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

export function useArticles(userId) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial fetch
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchArticles(userId)
      .then((data) => { if (!cancelled) setArticles(data); })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [userId]);

  const addArticle = useCallback(
    async (article) => {
      const temp = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        status: 'unlisted',
        buyPrice: 0,
        listPrice: 0,
        soldPrice: 0,
        fees: 0,
        shippingCost: 0,
        category: '',
        brand: '',
        size: '',
        listingTitle: '',
        listingDescription: '',
        notes: '',
        ...article,
      };
      // Optimistic
      setArticles((prev) => [temp, ...prev]);
      try {
        const saved = await insertArticle(temp, userId);
        // Replace temp with DB version (has real id if Supabase)
        setArticles((prev) => prev.map((a) => (a.id === temp.id ? saved : a)));
        return saved;
      } catch (err) {
        console.error(err);
        setArticles((prev) => prev.filter((a) => a.id !== temp.id));
      }
    },
    [userId]
  );

  const updateArticle = useCallback(
    async (id, changes) => {
      setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, ...changes } : a)));
      try {
        await updateArticleDb(id, changes);
      } catch (err) {
        console.error(err);
        // Revert — refetch
        fetchArticles(userId).then(setArticles);
      }
    },
    [userId]
  );

  const deleteArticle = useCallback(
    async (id) => {
      const backup = articles;
      setArticles((prev) => prev.filter((a) => a.id !== id));
      try {
        await deleteArticleDb(id);
      } catch (err) {
        console.error(err);
        setArticles(backup);
      }
    },
    [articles, userId]
  );

  return { articles, loading, addArticle, updateArticle, deleteArticle };
}
