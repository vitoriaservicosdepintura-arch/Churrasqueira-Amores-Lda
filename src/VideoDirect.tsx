import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
    VolumeX,
    Volume2,
    ShoppingCart,
    PhoneCall,
    ArrowLeft,
    ChevronUp,
    Info,
    UtensilsCrossed,
    X,
    LayoutGrid,
    ChevronDown
} from 'lucide-react';

export default function VideoDirect() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [config, setConfig] = useState<any>(null);
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [muted, setMuted] = useState(true);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
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

    const handleOrder = () => {
        if (!item) return;
        const msg = `Olá! Gostaria de pedir o prato: *${item.name}* (Via MenuVision 360°)`;
        window.open(`https://wa.me/${config?.contact?.phone || ''}?text=${encodeURIComponent(msg)}`, '_blank');
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
        <div className="fixed inset-0 bg-black overflow-hidden touch-none select-none">
            {/* Fullscreen Video Background */}
            <video
                ref={videoRef}
                src={item.videoUrl}
                autoPlay
                loop
                muted={muted}
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                onClick={() => setMuted(!muted)}
            />

            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

            {/* --- TOP BAR: Back Button & Minimal Info --- */}
            <div className="absolute top-0 inset-x-0 z-[100] p-6 flex items-center justify-between">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => {
                        if (window.history.length > 1) navigate(-1);
                        else navigate('/menuvision');
                    }}
                    className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-white border border-white/20 active:scale-90 transition-transform shadow-2xl backdrop-blur-xl"
                >
                    <ArrowLeft className="w-7 h-7" />
                </motion.button>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass border border-gold/30 px-5 py-2 rounded-2xl flex flex-col items-end backdrop-blur-2xl shadow-2xl"
                    onClick={() => setShowInfo(true)}
                >
                    <span className="text-white text-[10px] font-black uppercase tracking-widest">{item.name}</span>
                    <span className="text-gold text-lg font-black">{item.price}</span>
                </motion.div>
            </div>

            {/* --- VOLUME INDICATOR: Minimalist --- */}
            <AnimatePresence>
                {muted && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center gap-3"
                    >
                        <div className="w-16 h-16 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                            <VolumeX className="w-8 h-8 text-white/40" />
                        </div>
                        <span className="text-white/20 text-[8px] font-black uppercase tracking-[0.5em]">Toque para Som</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- BOTTOM ACTIONS: Floating Bar --- */}
            <div className="absolute bottom-10 inset-x-0 z-[200] px-6">
                <div className="max-w-md mx-auto grid grid-cols-4 gap-3">
                    {/* Mais Sugestões Button - Animated */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowSuggestions(true)}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="col-span-1 h-16 glass border border-white/20 rounded-2xl flex flex-col items-center justify-center text-white shadow-xl"
                    >
                        <LayoutGrid className="w-6 h-6 text-gold mb-1" />
                        <span className="text-[7px] font-black uppercase tracking-widest text-gray-400">Sugestões</span>
                    </motion.button>

                    {/* Pedir Agora - Main CTA */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleOrder}
                        className="col-span-2 h-16 bg-gradient-to-r from-gold via-flame to-ember rounded-2xl flex items-center justify-center gap-3 text-white shadow-[0_10px_30px_rgba(245,158,11,0.3)] border border-white/20"
                    >
                        <ShoppingCart className="w-6 h-6" />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Pedir Agora</span>
                    </motion.button>

                    {/* Garçom */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCallWaiter(item.name)}
                        className="col-span-1 h-16 glass border border-white/20 rounded-2xl flex flex-col items-center justify-center text-white"
                    >
                        <PhoneCall className="w-6 h-6 text-gold mb-1" />
                        <span className="text-[7px] font-black uppercase tracking-widest text-gray-400">Garçom</span>
                    </motion.button>
                </div>
            </div>

            {/* --- SUGGESTIONS MODAL/OVERLAY --- */}
            <AnimatePresence>
                {showSuggestions && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute inset-x-0 bottom-0 z-[300] bg-black/90 backdrop-blur-3xl border-t border-white/10 rounded-t-[3rem] p-8 pb-12 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <UtensilsCrossed className="w-5 h-5 text-gold" />
                                <h3 className="text-xl font-black text-white uppercase tracking-widest">Mais Sugestões</h3>
                            </div>
                            <button
                                onClick={() => setShowSuggestions(false)}
                                className="w-10 h-10 glass rounded-full flex items-center justify-center text-white active:scale-90"
                            >
                                <ChevronDown className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x">
                            {config?.menuItems?.filter((m: any) => m.id.toString() !== id && m.videoUrl).map((other: any) => (
                                <motion.div
                                    key={other.id}
                                    onClick={() => {
                                        navigate(`/v/${other.id}`);
                                        setShowSuggestions(false);
                                    }}
                                    className="min-w-[160px] h-56 rounded-[2rem] overflow-hidden glass border border-white/5 snap-center relative group"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <img src={other.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                    <div className="absolute bottom-5 left-5 right-5">
                                        <div className="text-[10px] font-black uppercase text-white truncate mb-1 leading-tight">
                                            {other.name}
                                        </div>
                                        <div className="text-[9px] font-bold text-gold">{other.price}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- INFO MODAL --- */}
            <AnimatePresence>
                {showInfo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[400] bg-black/60 backdrop-blur-xl flex items-center justify-center p-8"
                        onClick={() => setShowInfo(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="max-w-md w-full glass p-10 rounded-[3rem] border border-white/10"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 text-gold mb-4">
                                <Info className="w-6 h-6" />
                                <span className="text-xs font-black uppercase tracking-widest">Detalhes Gourmet</span>
                            </div>
                            <h2 className="text-3xl font-black text-white mb-4">{item.name}</h2>
                            <p className="text-gray-300 text-lg leading-relaxed italic">{item.description}</p>
                            <button
                                onClick={() => setShowInfo(false)}
                                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl text-gold font-black text-xs uppercase tracking-widest mt-8"
                            >
                                Fechar
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
