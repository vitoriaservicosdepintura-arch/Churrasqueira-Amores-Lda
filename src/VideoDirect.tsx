import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
    VolumeX,
    Volume2,
    ShoppingCart,
    ArrowLeft,
    ChevronUp,
    Info,
    X,
    LayoutGrid
} from 'lucide-react';

const stripHTML = (text: any) => {
    if (!text || typeof text !== 'string') return '';
    const cleanText = text.replace(/<[^>]*>?/gm, '');
    const doc = new DOMParser().parseFromString(cleanText, "text/html");
    return doc.documentElement.textContent || '';
};

export default function VideoDirect() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [config, setConfig] = useState<any>(null);
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [muted, setMuted] = useState(true);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
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
        const msg = `Olá! Gostaria de pedir o prato: *${stripHTML(item.name)}* (Via MenuVision 360°)`;
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
            {/* Blurred Background to fill the screen */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center blur-[80px] opacity-60 scale-125"
                style={{ backgroundImage: `url(${item.image})` }}
            />

            {/* Fullscreen Video Foreground */}
            <video
                ref={videoRef}
                src={item.videoUrl}
                autoPlay
                loop
                muted={muted}
                playsInline
                className="absolute inset-0 w-full h-full object-contain z-0"
            />

            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

            {/* --- TOP BAR: Back Button --- */}
            <div className="absolute top-0 left-0 z-[100] p-6">
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => navigate('/menuvision')}
                    className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-white border border-white/20 active:scale-90 transition-transform shadow-2xl backdrop-blur-xl"
                >
                    <ArrowLeft className="w-8 h-8" />
                </motion.button>
            </div>

            {/* --- NAME & PRICE PILL (Top Right) --- */}
            <div className="absolute top-6 right-6 z-[100]">
                <div className="glass border border-gold/30 px-5 py-2.5 rounded-2xl flex flex-col items-end backdrop-blur-3xl shadow-2xl">
                    <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">{stripHTML(item.name)}</span>
                    <span className="text-gold text-lg font-black">{item.price}</span>
                </div>
            </div>

            {/* --- ACTION AREA (Bottom) --- */}
            <div className="absolute bottom-6 inset-x-0 z-[200] px-6 space-y-4">

                {/* 1. SLIDE UP BUTTON (For Info) - Positioned above Order Button */}
                <div className="flex justify-center">
                    <motion.button
                        onClick={() => setShowDetails(true)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileTap={{ scale: 0.95 }}
                        className="group flex flex-col items-center gap-1 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 px-8 py-3 rounded-2xl transition-all"
                    >
                        <ChevronUp className="w-4 h-4 text-gold animate-bounce" />
                        <span className="text-[10px] font-black text-white/70 uppercase tracking-[0.3em]">Deslizar para cima</span>
                    </motion.button>
                </div>

                <div className="max-w-md mx-auto grid grid-cols-4 gap-3 items-end">
                    {/* MORE SUGGESTIONS BUTTON (Bottom Left) */}
                    <div className="col-span-1">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowSuggestions(true)}
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-full h-16 glass border border-white/10 rounded-2xl flex flex-col items-center justify-center text-white shadow-xl"
                        >
                            <LayoutGrid className="w-5 h-5 text-gold mb-1" />
                            <span className="text-[7px] font-black uppercase tracking-widest text-gray-500">Sugestões</span>
                        </motion.button>
                    </div>

                    {/* ORDER NOW BUTTON (Center) */}
                    <div className="col-span-2">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleOrder}
                            className="w-full h-16 bg-gradient-to-r from-gold via-flame to-ember rounded-2xl flex items-center justify-center gap-2 text-white shadow-[0_10px_30px_rgba(245,158,11,0.3)] border border-white/20"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Pedir Agora</span>
                        </motion.button>
                    </div>

                    {/* AUDIO BUTTON (Bottom Right) */}
                    <div className="col-span-1">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setMuted(!muted)}
                            className={`w-full h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-500 shadow-xl border ${muted ? 'glass border-white/10' : 'bg-gold border-gold'}`}
                        >
                            {muted ? (
                                <>
                                    <VolumeX className="w-5 h-5 text-white/50 mb-1" />
                                    <span className="text-[7px] font-black uppercase tracking-widest text-white/40">Som Off</span>
                                </>
                            ) : (
                                <>
                                    <Volume2 className="w-5 h-5 text-black mb-1 animate-pulse" />
                                    <span className="text-[7px] font-black uppercase tracking-widest text-black/60">Som On</span>
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>

                {/* CALL WAITER (Small link below everything) */}
                <button
                    onClick={() => handleCallWaiter(stripHTML(item.name))}
                    className="w-full text-center py-2 text-[8px] font-black text-white/30 uppercase tracking-[0.4em] active:text-gold"
                >
                    Chamar Garçom
                </button>
            </div>

            {/* --- DETAILS OVERLAY (From Swipe/Click) --- */}
            <AnimatePresence>
                {showDetails && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute inset-0 z-[300] bg-black/80 backdrop-blur-2xl flex items-end"
                        onClick={() => setShowDetails(false)}
                    >
                        <div
                            className="w-full glass p-10 rounded-t-[3rem] border-t border-white/10 shadow-2xl space-y-6"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-12 h-1 bg-gold/30 rounded-full mx-auto mb-4" />
                            <div className="flex items-center gap-3 text-gold">
                                <Info className="w-6 h-6" />
                                <span className="text-xs font-black uppercase tracking-[0.2em]">Detalhes do Prato</span>
                            </div>
                            <h2
                                className="text-3xl font-black text-white"
                                dangerouslySetInnerHTML={{ __html: item.name || '' }}
                            />
                            <p
                                className="text-gray-300 text-lg leading-relaxed italic"
                                dangerouslySetInnerHTML={{ __html: item.description || '' }}
                            />
                            <div className="bg-gold/10 p-4 rounded-2xl border border-gold/20">
                                <span className="text-[10px] font-black text-gold uppercase tracking-widest block mb-1">Preço Sugerido</span>
                                <span className="text-2xl font-black text-white">{item.price}</span>
                            </div>
                            <button
                                onClick={() => setShowDetails(false)}
                                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em]"
                            >
                                Fechar Detalhes
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- SUGGESTIONS OVERLAY --- */}
            <AnimatePresence>
                {showSuggestions && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute inset-x-0 bottom-0 z-[400] bg-black/90 backdrop-blur-3xl border-t border-white/10 rounded-t-[3rem] p-8 pb-12"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-xs font-black text-gold uppercase tracking-[0.3em]">Menu Sugestões</span>
                            <button onClick={() => setShowSuggestions(false)} className="w-10 h-10 glass rounded-full flex items-center justify-center text-white">
                                <X className="w-5 h-5" />
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
                                    className="min-w-[140px] h-48 rounded-[2rem] overflow-hidden glass border border-white/5 snap-center relative"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <img src={other.image} className="w-full h-full object-cover opacity-50" />
                                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent">
                                        <div className="text-[9px] font-black uppercase text-white truncate">{stripHTML(other.name)}</div>
                                        <div className="text-[8px] font-bold text-gold">{other.price}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
