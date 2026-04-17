import { supabase, isSupabaseConfigured } from '../lib/supabase';

// ===== Helper: camelCase <-> snake_case =====
function toSnake(obj) {
  const map = {
    buyPrice: 'buy_price',
    listPrice: 'list_price',
    soldPrice: 'sold_price',
    soldDate: 'sold_date',
    shippingCost: 'shipping_cost',
    listingTitle: 'listing_title',
    listingDescription: 'listing_description',
    imageUrl: 'image_url',
    sourceUrl: 'source_url',
    createdAt: 'created_at',
    userId: 'user_id',
  };
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[map[k] || k] = v;
  }
  return out;
}

function toCamel(obj) {
  const map = {
    buy_price: 'buyPrice',
    list_price: 'listPrice',
    sold_price: 'soldPrice',
    sold_date: 'soldDate',
    shipping_cost: 'shippingCost',
    listing_title: 'listingTitle',
    listing_description: 'listingDescription',
    image_url: 'imageUrl',
    source_url: 'sourceUrl',
    created_at: 'createdAt',
    user_id: 'userId',
  };
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[map[k] || k] = v;
  }
  return out;
}

// ===== localStorage fallback =====
const KEYS = {
  ARTICLES: 'vintrack_articles',
  PRESETS: 'vintrack_presets',
};

function loadLocal(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocal(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ===== Articles =====
export async function fetchArticles(userId) {
  if (!isSupabaseConfigured()) return loadLocal(KEYS.ARTICLES);
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(toCamel);
}

export async function insertArticle(article, userId) {
  if (!isSupabaseConfigured()) {
    const list = loadLocal(KEYS.ARTICLES);
    list.unshift(article);
    saveLocal(KEYS.ARTICLES, list);
    return article;
  }
  const row = toSnake({ ...article, userId });
  delete row.id; // let DB generate
  const { data, error } = await supabase.from('articles').insert(row).select().single();
  if (error) throw error;
  return toCamel(data);
}

export async function updateArticle(id, changes) {
  if (!isSupabaseConfigured()) {
    const list = loadLocal(KEYS.ARTICLES).map((a) => (a.id === id ? { ...a, ...changes } : a));
    saveLocal(KEYS.ARTICLES, list);
    return;
  }
  const { error } = await supabase.from('articles').update(toSnake(changes)).eq('id', id);
  if (error) throw error;
}

export async function deleteArticle(id) {
  if (!isSupabaseConfigured()) {
    saveLocal(KEYS.ARTICLES, loadLocal(KEYS.ARTICLES).filter((a) => a.id !== id));
    return;
  }
  const { error } = await supabase.from('articles').delete().eq('id', id);
  if (error) throw error;
}

// ===== Presets =====
export async function fetchPresets(userId) {
  if (!isSupabaseConfigured()) return loadLocal(KEYS.PRESETS);
  const { data, error } = await supabase
    .from('presets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(toCamel);
}

export async function insertPreset(preset, userId) {
  if (!isSupabaseConfigured()) {
    const list = loadLocal(KEYS.PRESETS);
    list.unshift(preset);
    saveLocal(KEYS.PRESETS, list);
    return preset;
  }
  const row = toSnake({ ...preset, userId });
  delete row.id;
  const { data, error } = await supabase.from('presets').insert(row).select().single();
  if (error) throw error;
  return toCamel(data);
}

export async function updatePreset(id, changes) {
  if (!isSupabaseConfigured()) {
    const list = loadLocal(KEYS.PRESETS).map((p) => (p.id === id ? { ...p, ...changes } : p));
    saveLocal(KEYS.PRESETS, list);
    return;
  }
  const { error } = await supabase.from('presets').update(toSnake(changes)).eq('id', id);
  if (error) throw error;
}

export async function deletePreset(id) {
  if (!isSupabaseConfigured()) {
    saveLocal(KEYS.PRESETS, loadLocal(KEYS.PRESETS).filter((p) => p.id !== id));
    return;
  }
  const { error } = await supabase.from('presets').delete().eq('id', id);
  if (error) throw error;
}
