import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
    VolumeX,
    Play,
    ShoppingCart,
    PhoneCall,
    ArrowLeft,
    ChevronUp,
    Info,
    UtensilsCrossed,
    X,
    MessageSquare
} from 'lucide-react';

export default function VideoDirect() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [config, setConfig] = useState<any>(null);
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [muted, setMuted] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showFullInfo, setShowFullInfo] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const loadItem = async () => {
            try {
                const { data } = await supabase
                    .from('settings')
                    .select('config')
                    .eq('id', 1)
                    .single();

                if (data?.config) {
                    setConfig(data.config);
                    if (data.config.menuItems) {
                        const found = data.config.menuItems.find((m: any) => m.id.toString() === id);
                        if (found) {
                            setItem(found);
                        }
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadItem();
    }, [id]);

    const handleCallWaiter = (dishName?: string) => {
        const msg = dishName
            ? `Olá! Estou na mesa e preciso de assistência para o prato: *${dishName}*`
            : `Olá! Estou na mesa e gostaria de chamar um garçom.`;
        window.open(`https://wa.me/${config?.contact?.phone || ''}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    const handleAction = (type: 'order' | 'waiter') => {
        if (!item) return;
        if (type === 'order') {
            const msg = `Olá! Gostaria de pedir o prato: *${item.name}* (Via MenuVision 360°)`;
            window.open(`https://wa.me/${config?.contact?.phone || ''}?text=${encodeURIComponent(msg)}`, '_blank');
        } else {
            handleCallWaiter(item.name);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-deep flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (!item) return null;

    return (
        <div className="fixed inset-0 bg-black overflow-hidden touch-none">
            {/* Fullscreen Video Background */}
            <video
                ref={videoRef}
                src={item.videoUrl}
                autoPlay
                loop
                muted={muted}
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

            {/* Top Bar: Back Button & Price Tag */}
            <div className="absolute top-0 inset-x-0 z-[100] p-6 flex items-center justify-between pointer-events-none">
                <button
                    onClick={() => navigate(-1)}
                    className="w-12 h-12 glass rounded-full flex items-center justify-center text-white border border-white/10 active:scale-90 pointer-events-auto backdrop-blur-xl"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass border border-gold/30 px-5 py-2.5 rounded-full flex items-center gap-3 backdrop-blur-2xl pointer-events-auto shadow-2xl"
                >
                    <div className="flex flex-col items-end">
                        <span className="text-white text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1">{item.name}</span>
                        <span className="text-gold text-lg font-black leading-none">{item.price}</span>
                    </div>
                </motion.div>
            </div>

            {/* Interaction Layer */}
            <div className="absolute inset-0 z-10" onClick={() => { if (isMenuOpen || showFullInfo) { setIsMenuOpen(false); setShowFullInfo(false); } else setMuted(!muted); }}>
                <AnimatePresence>
                    {muted && !isMenuOpen && !showFullInfo && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 pointer-events-none"
                        >
                            <div className="w-20 h-20 rounded-full bg-gold/10 backdrop-blur-md border border-gold/20 flex items-center justify-center animate-pulse">
                                <VolumeX className="w-8 h-8 text-gold" />
                            </div>
                            <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.4em]">Toque para Som</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ℹ️ Full Description Overlay (Non-intrusive) */}
            <AnimatePresence>
                {showFullInfo && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-0 z-[300] flex items-center justify-center p-8 bg-black/60 backdrop-blur-xl"
                        onClick={() => setShowFullInfo(false)}
                    >
                        <div className="max-w-md w-full glass p-10 rounded-[3rem] border border-white/10 shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center gap-3 text-gold mb-2">
                                <UtensilsCrossed className="w-6 h-6" />
                                <span className="text-xs font-black uppercase tracking-widest">Detalhes do Prato</span>
                            </div>
                            <h2 className="text-3xl font-black text-white">{item.name}</h2>
                            <p className="text-gray-300 text-lg italic leading-relaxed">{item.description}</p>
                            <button
                                onClick={() => setShowFullInfo(false)}
                                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-xs uppercase tracking-widest mt-4"
                            >
                                Fechar
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 🔥 Floating Animated Menu (FAB) */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[400] flex flex-col items-center">
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.5 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.5 }}
                            className="flex flex-col gap-4 mb-6 items-center"
                        >
                            {/* Info Button */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => { e.stopPropagation(); setShowFullInfo(true); setIsMenuOpen(false); }}
                                className="w-14 h-14 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full flex flex-col items-center justify-center text-white"
                            >
                                <Info className="w-5 h-5 text-gray-400" />
                                <span className="text-[7px] font-black uppercase mt-1">Info</span>
                            </motion.button>

                            {/* Waiter Button */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => { e.stopPropagation(); handleAction('waiter'); }}
                                className="w-16 h-16 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-full flex flex-col items-center justify-center text-white shadow-xl"
                            >
                                <PhoneCall className="w-6 h-6 text-gold" />
                                <span className="text-[8px] font-black uppercase mt-1 tracking-widest">Garçom</span>
                            </motion.button>

                            {/* Order Button - Large & Glowing */}
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => { e.stopPropagation(); handleAction('order'); }}
                                className="w-24 h-24 bg-gradient-to-br from-gold via-flame to-ember rounded-full flex flex-col items-center justify-center text-white shadow-[0_0_50px_rgba(245,158,11,0.5)] border border-white/30"
                            >
                                <ShoppingCart className="w-10 h-10 mb-1" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Pedir</span>
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* The Central Animated Switch */}
                <motion.button
                    onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                    animate={{
                        scale: isMenuOpen ? 1 : [1, 1.08, 1],
                        rotate: isMenuOpen ? 45 : 0,
                        backgroundColor: isMenuOpen ? "#ffffff" : "#F59E0B"
                    }}
                    transition={{
                        scale: { repeat: isMenuOpen ? 0 : Infinity, duration: 2.5, ease: "easeInOut" },
                        default: { type: "spring", stiffness: 400, damping: 25 }
                    }}
                    className="w-20 h-20 rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[410]"
                >
                    {isMenuOpen ? <X className="w-10 h-10 text-black" /> : <Play className="w-10 h-10 text-black fill-current ml-1" />}
                </motion.button>
            </div>

            {/* ↔️ Suggestions Peek (Swipeable drawer at the very bottom) */}
            <div className="absolute bottom-0 inset-x-0 z-[500] group pointer-events-auto">
                <div className="flex flex-col items-center pointer-events-none pb-4">
                    <ChevronUp className="w-5 h-5 text-white/30 animate-bounce" />
                    <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.5em]">Mais Sugestões</span>
                </div>

                <div className="h-[120px] bg-black/80 backdrop-blur-3xl border-t border-white/5 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
                    <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x">
                        {config?.menuItems?.filter((m: any) => m.id.toString() !== id && m.videoUrl).map((other: any) => (
                            <motion.div
                                key={other.id}
                                onClick={() => navigate(`/v/${other.id}`)}
                                className="min-w-[120px] h-20 rounded-2xl overflow-hidden glass border border-white/5 snap-center relative"
                                whileTap={{ scale: 0.95 }}
                            >
                                <img src={other.image} className="w-full h-full object-cover opacity-50" />
                                <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black to-transparent">
                                    <span className="text-[7px] font-black text-white uppercase truncate">{other.name}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
