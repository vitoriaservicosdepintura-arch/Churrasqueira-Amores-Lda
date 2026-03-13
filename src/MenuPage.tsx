import { useState, useEffect, useMemo } from 'react';
import { supabase } from './supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, SlidersHorizontal } from 'lucide-react';

/* ══════════════════════════════════════════
   UTILS
   ══════════════════════════════════════════ */

const stripHTML = (text: any) => {
    if (!text || typeof text !== 'string') return '';
    const cleanText = text.replace(/<[^>]*>?/gm, '');
    const doc = new DOMParser().parseFromString(cleanText, 'text/html');
    return doc.documentElement.textContent || '';
};

const getTextStyle = (color: string) => {
    if (!color) return {};
    if (color.includes('gradient')) {
        return {
            background: color,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
            display: 'inline-block',
        };
    }
    return { color };
};

/* ══════════════════════════════════════════
   DEFAULT CONFIG
   ══════════════════════════════════════════ */

const DEFAULT_CONFIG = {
    logo: '🔥',
    logoIsImage: false,
    hero: { title: "Chave D'Ouro Café" },
    menuItems: [] as any[],
};

/* ══════════════════════════════════════════
   EMBER PARTICLES
   ══════════════════════════════════════════ */

function EmberParticles() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const embers = useMemo(
        () =>
            Array.from({ length: isMobile ? 8 : 20 }, (_, i) => ({
                id: i,
                left: Math.random() * 100,
                size: Math.random() * 3 + 1.5,
                duration: Math.random() * 8 + 5,
                delay: Math.random() * 6,
                color: ['#f59e0b', '#f97316', '#ef4444', '#fbbf24', '#fb923c'][Math.floor(Math.random() * 5)],
            })),
        [isMobile]
    );

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {embers.map((e) => (
                <div
                    key={e.id}
                    className="ember-particle"
                    style={{
                        left: `${e.left}%`,
                        bottom: '-10px',
                        width: `${e.size}px`,
                        height: `${e.size}px`,
                        backgroundColor: e.color,
                        animationDuration: `${e.duration}s`,
                        animationDelay: `${e.delay}s`,
                        boxShadow: `0 0 ${e.size * 3}px ${e.color}`,
                    }}
                />
            ))}
        </div>
    );
}

/* ══════════════════════════════════════════
   MENU PAGE COMPONENT
   ══════════════════════════════════════════ */

export default function MenuPage() {
    const [config, setConfig] = useState<any>(DEFAULT_CONFIG);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [search, setSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Load config from Supabase
    useEffect(() => {
        const load = async () => {
            try {
                const cached = localStorage.getItem('siteConfig');
                if (cached) setConfig({ ...DEFAULT_CONFIG, ...JSON.parse(cached) });

                const { data } = await supabase
                    .from('site_config')
                    .select('config')
                    .eq('id', 1)
                    .single();

                if (data?.config) {
                    const merged = { ...DEFAULT_CONFIG, ...data.config };
                    setConfig(merged);
                    localStorage.setItem('siteConfig', JSON.stringify(merged));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const categories = useMemo(() => {
        const cats = ['Todos', ...new Set((config.menuItems || []).map((m: any) => m.category).filter(Boolean))];
        return cats;
    }, [config.menuItems]);

    const filtered = useMemo(() => {
        let items = config.menuItems || [];
        if (activeCategory !== 'Todos') items = items.filter((m: any) => m.category === activeCategory);
        if (search.trim()) {
            const q = search.toLowerCase();
            items = items.filter((m: any) =>
                m.name?.toLowerCase().includes(q) ||
                m.description?.toLowerCase().includes(q) ||
                m.category?.toLowerCase().includes(q)
            );
        }
        return items;
    }, [config.menuItems, activeCategory, search]);

    const siteName = stripHTML(config.hero?.title || "Chave D'Ouro Café");

    if (loading) {
        return (
            <div className="fixed inset-0 bg-deep flex items-center justify-center">
                <motion.div
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-gold via-flame to-ember flex items-center justify-center shadow-2xl shadow-flame/40 overflow-hidden"
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                    {config.logoIsImage ? (
                        <img src={config.logo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-4xl">{config.logo || '🔥'}</span>
                    )}
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-deep text-white font-display noise-overlay selection:bg-gold/30">

            {/* ── HEADER ─────────────────────────── */}
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="sticky top-0 z-50 bg-deep/90 backdrop-blur-2xl border-b border-white/5 shadow-xl shadow-black/30"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 md:h-20 gap-4">
                    {/* Back Button */}
                    <motion.a
                        href="/"
                        className="flex items-center gap-2 text-gray-400 hover:text-gold transition-colors shrink-0 group"
                        whileHover={{ x: -3 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Voltar à página principal"
                    >
                        <div className="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-gold/10 group-hover:border-gold/30 border border-white/10 flex items-center justify-center transition-all duration-300">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="hidden sm:block text-sm font-semibold">Voltar</span>
                    </motion.a>

                    {/* Logo + Title */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-gold via-flame to-ember flex items-center justify-center shadow-lg shadow-flame/30 overflow-hidden shrink-0">
                            {config.logoIsImage ? (
                                <img src={config.logo} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xl md:text-2xl">{config.logo || '🔥'}</span>
                            )}
                        </div>
                        <div className="text-center">
                            <span
                                className="block text-sm md:text-base font-black leading-tight"
                                style={getTextStyle(config.hero?.titleColor)}
                            >
                                {siteName}
                            </span>
                            <span className="block text-[10px] text-gold font-bold uppercase tracking-widest opacity-80">
                                Menu & Destaques
                            </span>
                        </div>
                    </div>

                    {/* Reserve button */}
                    <motion.a
                        href="/"
                        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gold to-flame rounded-full text-xs font-bold text-white shadow-lg shadow-flame/25 shrink-0"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        📞 Reservar
                    </motion.a>

                    {/* Mobile filter toggle */}
                    <button
                        onClick={() => setShowFilters((p) => !p)}
                        className="sm:hidden w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold/30 transition-all"
                        aria-label="Filtros"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>
                </div>

                {/* Mobile search + category bar */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden sm:hidden border-t border-white/5"
                        >
                            <div className="px-4 py-3 space-y-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Pesquisar prato..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full bg-surface border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-gold text-white placeholder:text-gray-600"
                                    />
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {categories.map((cat: string) => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${activeCategory === cat
                                                ? 'bg-gradient-to-r from-gold to-flame text-white shadow-md shadow-flame/25'
                                                : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* ── HERO BANNER ─────────────────────── */}
            <div className="relative h-44 md:h-64 overflow-hidden">
                {config.hero?.bgImage && (
                    <div
                        className="absolute inset-0 bg-cover bg-center scale-110"
                        style={{ backgroundImage: `url(${config.hero.bgImage})` }}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-deep/60 via-deep/40 to-deep" />
                <div className="absolute inset-0 bg-gradient-to-r from-deep/60 via-transparent to-deep/60" />
                <EmberParticles />
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="inline-block px-3 py-1 bg-flame/15 border border-flame/30 rounded-full text-flame text-[10px] font-bold tracking-widest uppercase mb-3"
                    >
                        Menu & Destaques
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.7 }}
                        className="text-3xl md:text-5xl font-black leading-tight"
                    >
                        Os Nossos <span className="text-gradient-fire">Pratos Estrela</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-gray-400 text-xs md:text-sm mt-2 max-w-lg"
                    >
                        Cada prato preparado com ingredientes frescos e amor de uma tradição familiar
                    </motion.p>
                </div>
            </div>

            {/* ── DESKTOP SEARCH + FILTERS ─────────── */}
            <div className="hidden sm:block sticky top-[64px] md:top-[80px] z-40 bg-deep/95 backdrop-blur-xl border-b border-white/5 py-4 shadow-lg shadow-black/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center gap-4">
                    {/* Search */}
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Pesquisar prato..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-surface border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-gold text-white placeholder:text-gray-600 transition-colors"
                        />
                    </div>
                    {/* Category Pills */}
                    <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
                        {categories.map((cat: string) => (
                            <motion.button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${activeCategory === cat
                                    ? 'bg-gradient-to-r from-gold via-flame to-ember text-white shadow-lg shadow-flame/25'
                                    : 'glass text-gray-400 hover:text-white hover:border-gold/20'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {cat}
                            </motion.button>
                        ))}
                    </div>
                    {/* Count */}
                    <span className="ml-auto text-xs text-gray-500 font-medium shrink-0">
                        {filtered.length} {filtered.length === 1 ? 'prato' : 'pratos'}
                    </span>
                </div>
            </div>

            {/* ── MENU GRID ───────────────────────── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14 pb-28">
                {filtered.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-24 text-center"
                    >
                        <div className="text-6xl mb-4">🍽️</div>
                        <h3 className="text-xl font-bold text-gray-300 mb-2">Nenhum prato encontrado</h3>
                        <p className="text-gray-500 text-sm">Tente uma categoria diferente ou remova o filtro de pesquisa</p>
                        <button
                            onClick={() => { setSearch(''); setActiveCategory('Todos'); }}
                            className="mt-6 px-5 py-2.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm font-semibold hover:bg-gold/20 transition-colors"
                        >
                            Limpar filtros
                        </button>
                    </motion.div>
                ) : (
                    <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                        <AnimatePresence mode="popLayout">
                            {filtered.map((item: any, i: number) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 30, scale: 0.92 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                    transition={{ duration: 0.4, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                                    className="group"
                                >
                                    <motion.div
                                        className="glass rounded-2xl overflow-hidden hover:border-gold/20 transition-all duration-500 h-full flex flex-col cursor-pointer"
                                        whileHover={{ y: -6 }}
                                        onClick={() => {
                                            if (item.videoUrl) window.location.href = `/item/${item.id}`;
                                        }}
                                    >
                                        {/* Image */}
                                        <div className="relative h-56 md:h-64 overflow-hidden">
                                            <motion.img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/20 to-transparent" />

                                            {/* Play Hint */}
                                            {item.videoUrl && (
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="w-16 h-16 rounded-full bg-gold/20 backdrop-blur-md border border-gold/50 flex items-center justify-center">
                                                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-gold border-b-[10px] border-b-transparent ml-1" />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                                            {item.tag && (
                                                <div className="absolute top-4 left-4 px-3 py-1 bg-deep/80 backdrop-blur-sm rounded-full text-[10px] font-bold border border-white/10 text-gold uppercase tracking-widest">
                                                    {item.tag}
                                                </div>
                                            )}
                                            <motion.div
                                                className="absolute bottom-4 left-4 px-4 py-2 bg-gradient-to-r from-gold to-flame rounded-full text-lg font-black shadow-lg shadow-flame/30"
                                            >
                                                {item.price}
                                            </motion.div>
                                        </div>

                                        {/* Footer - Enlarged QR */}
                                        <div className="mt-auto p-4 md:p-5 pt-0 flex items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <span className="text-[10px] text-gray-500 font-bold px-2 py-0.5 bg-white/5 rounded-full uppercase tracking-wider">
                                                    {item.category}
                                                </span>
                                            </div>

                                            {item.qrCode || item.videoUrl || item.manualLink ? (
                                                <motion.div
                                                    className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-2xl p-2 shadow-[0_0_30px_rgba(255,255,255,0.15)] border-2 border-gold/30 cursor-pointer relative z-10 shrink-0"
                                                    whileHover={{ scale: 1.1, rotate: 2 }}
                                                    animate={{
                                                        boxShadow: ['0 0 0px rgba(245,158,11,0)', '0 0 20px rgba(245,158,11,0.4)', '0 0 0px rgba(245,158,11,0)'],
                                                        borderColor: ['rgba(245,158,11,0.2)', 'rgba(245,158,11,0.6)', 'rgba(245,158,11,0.2)']
                                                    }}
                                                    transition={{ repeat: Infinity, duration: 2.5 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (item.videoUrl) {
                                                            window.location.href = `/item/${item.id}`;
                                                        } else if (item.manualLink) {
                                                            window.location.href = item.manualLink;
                                                        }
                                                    }}
                                                    title="Escanear para Ver Vídeo"
                                                >
                                                    <img
                                                        src={item.qrCode || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                                                            item.videoUrl ? `${window.location.origin}/item/${item.id}` : (item.manualLink || '')
                                                        )}`}
                                                        alt={`QR Code ${item.name}`}
                                                        className="w-full h-full object-contain"
                                                    />
                                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gold text-deep text-[8px] font-black px-2 py-0.5 rounded-full whitespace-nowrap shadow-lg">
                                                        ESCANEAR
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <motion.a
                                                    href="/"
                                                    className="flex items-center gap-1.5 text-[11px] font-bold text-gold border border-gold/30 rounded-full px-3 py-1.5 hover:bg-gold/10 transition-colors shrink-0"
                                                    whileHover={{ x: 2 }}
                                                >
                                                    Reservar →
                                                </motion.a>
                                            )}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </main>

            {/* ── MOBILE BOTTOM BAR ───────────────── */}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom,16px)] pt-2 bg-gradient-to-t from-deep via-deep/95 to-transparent">
                <div className="mx-3 mb-2 bg-surface/90 backdrop-blur-3xl border border-white/10 rounded-3xl py-3 px-4 shadow-[0_-10px_40px_rgba(0,0,0,0.6)] flex items-center justify-between gap-2">
                    <a href="/" className="flex flex-col items-center gap-1 text-gray-400 active:text-gold transition-colors flex-1">
                        <span className="text-lg">🏠</span>
                        <span className="text-[9px] font-black uppercase tracking-tighter opacity-80">Início</span>
                    </a>
                    <div className="relative flex-none">
                        <a
                            href="/"
                            className="w-14 h-14 bg-gradient-to-br from-gold via-flame to-ember rounded-full flex flex-col items-center justify-center shadow-[0_8px_25px_rgba(249,115,22,0.4)] border-4 border-deep active:scale-90 transition-transform"
                        >
                            <span className="text-xl mt-0.5">📞</span>
                            <span className="bg-deep/30 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase -mt-0.5">Reservar</span>
                        </a>
                    </div>
                    <button
                        onClick={() => { setSearch(''); setActiveCategory('Todos'); }}
                        className="flex flex-col items-center gap-1 text-gray-400 active:text-gold transition-colors flex-1"
                    >
                        <span className="text-lg">🍽️</span>
                        <span className="text-[9px] font-black uppercase tracking-tighter opacity-80">Todos</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
