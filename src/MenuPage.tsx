import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { supabase } from './supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Search, SlidersHorizontal } from 'lucide-react';

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
   STAR RATING
   ══════════════════════════════════════════ */

// StarRating removed as it was unused


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
   ANIMATED SECTION
   ══════════════════════════════════════════ */

// AnimatedSection removed as it was unused


/* ══════════════════════════════════════════
   MENU PAGE COMPONENT
   ══════════════════════════════════════════ */

export default function MenuPage() {
    const [config, setConfig] = useState<any>(DEFAULT_CONFIG);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [search, setSearch] = useState('');
    const [selectedQR, setSelectedQR] = useState<string | null>(null);
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
                                        className="glass rounded-2xl overflow-hidden hover:border-gold/20 transition-all duration-500 h-full flex flex-col"
                                        whileHover={{ y: -6 }}
                                    >
                                        {/* Image */}
                                        <div className="relative h-48 md:h-52 overflow-hidden">
                                            <motion.img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-deep/80 via-deep/10 to-transparent" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                                            {item.tag && (
                                                <div className="absolute top-3 left-3 px-2.5 py-1 bg-deep/75 backdrop-blur-sm rounded-full text-[10px] font-bold border border-white/10">
                                                    {item.tag}
                                                </div>
                                            )}
                                            <motion.div
                                                className="absolute bottom-3 right-3 px-3 py-1.5 bg-gradient-to-r from-gold to-flame rounded-full text-sm font-extrabold shadow-lg shadow-flame/30"
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                {item.price}
                                            </motion.div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 md:p-5 flex-1 flex flex-col">
                                            <h2
                                                className="text-base md:text-lg font-bold mb-1.5 group-hover:text-gold transition-colors duration-300"
                                                style={getTextStyle(item.nameColor)}
                                            >
                                                {item.name}
                                            </h2>
                                            <p className="text-gray-400 text-xs md:text-sm leading-relaxed flex-1" style={getTextStyle(item.descColor)}>
                                                {item.description}
                                            </p>

                                            {/* Footer */}
                                            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                                                <span className="text-[10px] text-gray-500 font-medium px-2 py-0.5 bg-white/5 rounded-full">
                                                    {item.category}
                                                </span>

                                                {item.qrCode || item.videoUrl || item.manualLink ? (
                                                    <motion.div
                                                        className="w-14 h-14 bg-white rounded-xl p-1.5 shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-white/10 cursor-zoom-in relative z-10 shrink-0"
                                                        whileHover={{ scale: 1.2, rotate: 5 }}
                                                        animate={{ boxShadow: ['0 0 0px rgba(245,158,11,0)', '0 0 15px rgba(245,158,11,0.3)', '0 0 0px rgba(245,158,11,0)'] }}
                                                        transition={{ repeat: Infinity, duration: 2 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const qrLink = item.qrCode || `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
                                                                item.videoUrl ? `${window.location.origin}/item/${item.id}` : (item.manualLink || '')
                                                            )}`;
                                                            setSelectedQR(qrLink);
                                                        }}
                                                        title="Ampliar QR Code"
                                                    >
                                                        <img
                                                            src={item.qrCode || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                                                                item.videoUrl ? `${window.location.origin}/item/${item.id}` : (item.manualLink || '')
                                                            )}`}
                                                            alt={`QR Code ${item.name}`}
                                                            className="w-full h-full object-contain"
                                                        />
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

            {/* ── QR CODE POPUP ───────────────────── */}
            <AnimatePresence>
                {selectedQR && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedQR(null)}
                        className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl cursor-zoom-out"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-[420px] bg-white rounded-3xl p-6 md:p-10 shadow-[0_0_100px_rgba(255,255,255,0.15)] flex flex-col items-center mx-4"
                        >
                            <div className="absolute -top-10 -left-10 w-20 h-20 bg-gold/20 rounded-full blur-3xl" />
                            <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-flame/20 rounded-full blur-3xl" />

                            <button
                                onClick={() => setSelectedQR(null)}
                                className="absolute -top-14 right-0 text-white hover:text-gold transition-all duration-300 flex items-center gap-2 font-black text-xs uppercase tracking-widest group"
                            >
                                FECHAR{' '}
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-gold group-hover:text-deep transition-all">
                                    <X className="w-6 h-6" />
                                </div>
                            </button>

                            <div className="text-center mb-6 relative">
                                <div className="h-px w-12 bg-gold/30 mx-auto mb-4" />
                                <span className="text-deep font-black text-[10px] md:text-xs uppercase tracking-[0.3em] block mb-1">Menu Digital</span>
                                <h3 className="text-2xl font-black text-deep mb-2">Escaneie o Código</h3>
                                <p className="text-gray-500 text-[10px] md:text-xs font-medium max-w-[200px] mx-auto leading-relaxed">
                                    Aponte a câmera do seu telemóvel para realizar o seu pedido agora.
                                </p>
                            </div>

                            <div className="relative p-2 bg-gradient-to-br from-gold/20 via-transparent to-flame/20 rounded-3xl mb-6 group">
                                <div className="absolute inset-0 bg-white/50 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                <div className="relative bg-white p-5 rounded-2xl shadow-xl border border-gray-100">
                                    <img
                                        src={selectedQR}
                                        alt="QR Code Ampliado"
                                        className="w-full h-auto aspect-square object-contain rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="w-full pt-4 border-t border-gray-100">
                                <p className="text-[10px] text-gray-400 font-bold text-center uppercase tracking-widest opacity-50">
                                    {siteName} • Menu Digital
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
