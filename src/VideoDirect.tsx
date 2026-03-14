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
    ChevronUp
} from 'lucide-react';

export default function VideoDirect() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [config, setConfig] = useState<any>(null);
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [muted, setMuted] = useState(true);
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

            {/* Overlays */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

            {/* Top Control Bar */}
            <div className="absolute top-0 inset-x-0 z-50 p-6 flex items-center justify-between">
                <button
                    onClick={() => {
                        if (window.history.length > 1) {
                            navigate(-1);
                        } else {
                            navigate('/menuvision');
                        }
                    }}
                    className="w-12 h-12 glass rounded-full flex items-center justify-center text-white border border-white/10 active:scale-90 active:bg-white/20 transition-all z-[100]"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="bg-gold/20 backdrop-blur-md border border-gold/40 px-4 py-1.5 rounded-full">
                    <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">MenuVision 360°</span>
                </div>
                <div className="w-12" /> {/* Spacer */}
            </div>

            {/* Interaction Layer (Mute toggle & Swipe) */}
            <motion.div
                className="absolute inset-0 z-10"
                onClick={() => setMuted(!muted)}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragEnd={(_, info) => {
                    if (info.offset.y < -100) {
                        const footer = document.querySelector('.bottom-0');
                        footer?.scrollIntoView({ behavior: 'smooth' });
                    } else if (info.offset.y > 100) {
                        navigate(-1);
                    }
                }}
            >
                <AnimatePresence>
                    {muted && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-24 inset-x-0 flex justify-center pointer-events-none z-[60]"
                        >
                            <div className="bg-gold/20 backdrop-blur-xl border border-gold/40 px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl shadow-gold/10">
                                <div className="w-2 h-2 rounded-full bg-gold animate-pulse shadow-[0_0_100px_rgba(245,158,11,1)]" />
                                <span className="text-white text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Cliquem para Ativar o Som</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Vertical Side Controls */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
                    <motion.button
                        onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${muted ? 'bg-white/10 border border-white/20' : 'bg-gold border border-gold shadow-gold/30'}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        animate={muted ? { scale: [1, 1.05, 1] } : {}}
                        transition={muted ? { repeat: Infinity, duration: 2 } : {}}
                    >
                        {muted ? <VolumeX className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-black fill-black" />}
                    </motion.button>
                </div>
            </motion.div>

            {/* Details & Menu Section (Floating Bottom) */}
            <div className="absolute bottom-0 inset-x-0 z-40 p-6 space-y-6 pb-12">
                {/* Product Bio */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                >
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-black text-white drop-shadow-2xl">{item.name}</h1>
                        <span className="bg-gold px-3 py-1 rounded-lg text-black text-[10px] font-black">{item.price}</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed max-w-md line-clamp-2 drop-shadow-lg italic">
                        {item.description}
                    </p>
                </motion.div>

                {/* Action Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <motion.button
                        onClick={() => handleAction('order')}
                        className="bg-white text-black h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-2xl active:scale-95 transition-all"
                    >
                        <ShoppingCart className="w-4 h-4" /> Pedir Agora
                    </motion.button>
                    <motion.button
                        onClick={() => handleAction('waiter')}
                        className="md:hidden glass border border-white/10 text-white h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-2xl active:scale-95 transition-all"
                    >
                        <PhoneCall className="w-4 h-4 text-gold" /> Garçom
                    </motion.button>
                </div>

                {/* Other Dishes (Snap Carousel) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Outras Sugestões</span>
                        <ChevronUp className="w-4 h-4 text-gray-600 animate-bounce" />
                    </div>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
                        {config?.menuItems?.filter((m: any) => m.id.toString() !== id && m.videoUrl).map((other: any) => (
                            <motion.div
                                key={other.id}
                                onClick={() => navigate(`/v/${other.id}`)}
                                className="min-w-[120px] h-40 rounded-2xl overflow-hidden glass border border-white/5 snap-center relative group"
                                whileTap={{ scale: 0.95 }}
                            >
                                <img src={other.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="absolute bottom-3 left-3 right-3 text-[8px] font-black uppercase text-white truncate leading-tight">
                                    {other.name}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
