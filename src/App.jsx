import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Package, Zap, LogOut, Loader2 } from 'lucide-react';
import AnimatedBackground from './components/AnimatedBackground';
import Dashboard from './components/Dashboard';
import ArticleList from './components/ArticleList';
import PresetManager from './components/PresetManager';
import AuthScreen from './components/AuthScreen';
import { useArticles } from './hooks/useArticles';
import { usePresets } from './hooks/usePresets';
import { useAuth } from './hooks/useAuth';
import './App.css';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'articles', label: 'Articles', icon: Package },
  { id: 'presets', label: 'Presets', icon: Zap },
];

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="loading-content"
      >
        <span className="logo-icon logo-icon-lg">V</span>
        <Loader2 size={24} className="spin" />
      </motion.div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const { user, loading: authLoading, signIn, signUp, signOut, isConfigured } = useAuth();
  const userId = user?.id;
  const { articles, loading: articlesLoading, addArticle, updateArticle, deleteArticle } = useArticles(userId);
  const { presets, loading: presetsLoading, addPreset, updatePreset, deletePreset } = usePresets(userId);

  const dataLoading = articlesLoading || presetsLoading;

  // Auth loading
  if (authLoading) {
    return (
      <>
        <AnimatedBackground />
        <LoadingScreen />
      </>
    );
  }

  // Not logged in (only when Supabase is configured)
  if (!user && isConfigured) {
    return (
      <>
        <AnimatedBackground />
        <AuthScreen onSignIn={signIn} onSignUp={signUp} />
      </>
    );
  }

  return (
    <>
      <AnimatedBackground />
      <div className="app-shell">
        <header className="app-header">
          <div className="logo">
            <span className="logo-icon">V</span>
            <span className="logo-text">Vintrack</span>
          </div>
          <div className="header-right">
            <nav className="tab-nav">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  className={`tab-btn ${tab === t.id ? 'active' : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  <t.icon size={18} />
                  <span>{t.label}</span>
                  {tab === t.id && (
                    <motion.div className="tab-indicator" layoutId="tab-indicator" />
                  )}
                </button>
              ))}
            </nav>
            {isConfigured && (
              <button className="btn-icon" onClick={signOut} title="Sign out">
                <LogOut size={18} />
              </button>
            )}
          </div>
        </header>

        <main className="app-main">
          {dataLoading ? (
            <motion.div
              className="data-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Loader2 size={28} className="spin" />
              <span>Loading your data...</span>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {tab === 'dashboard' && (
                <motion.div key="dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <Dashboard articles={articles} />
                </motion.div>
              )}
              {tab === 'articles' && (
                <motion.div key="art" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <ArticleList
                    articles={articles}
                    addArticle={addArticle}
                    updateArticle={updateArticle}
                    deleteArticle={deleteArticle}
                    presets={presets}
                  />
                </motion.div>
              )}
              {tab === 'presets' && (
                <motion.div key="pre" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <PresetManager
                    presets={presets}
                    addPreset={addPreset}
                    updatePreset={updatePreset}
                    deletePreset={deletePreset}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </main>
      </div>
    </>
  );
}
