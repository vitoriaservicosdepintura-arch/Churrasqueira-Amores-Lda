import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
    VolumeX,
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
        const loadData = async () => {
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
                        if (found) setItem(found);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleCallWaiter = (dishName?: string) => {
        const phone = config?.contact?.phone || '351282798417';
        const msg = `Olá! Estou vendo o vídeo do prato *${dishName || item?.name}* e gostaria de assistência na mesa.`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    const handleOrder = (dishName?: string) => {
        const phone = config?.contact?.phone || '351282798417';
        const msg = `Olá! Acabei de ver o vídeo imersivo do prato *${dishName || item?.name}* e quero fazer um pedido agora!`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!item || !item.videoUrl) {
        return (
            <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 text-center">
                <h1 className="text-white text-xl font-bold mb-4">Vídeo não disponível</h1>
                <button onClick={() => navigate('/menuvision')} className="px-6 py-3 bg-gold text-black rounded-full font-bold uppercase tracking-widest text-xs">Voltar ao Menu</button>
            </div>
        );
    }

    const otherItems = (config?.menuItems || []).filter((m: any) => m.id.toString() !== id).slice(0, 10);

    return (
        <div className="fixed inset-0 bg-black h-screen w-screen overflow-hidden font-sans select-none">
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
                        // Swipe Up - Scroll para os outros pratos
                        const footer = document.querySelector('.bottom-0');
                        footer?.scrollIntoView({ behavior: 'smooth' });
                    } else if (info.offset.y > 100) {
                        // Swipe Down - Voltar
                        navigate(-1);
                    }
                }}
            >
                <AnimatePresence>
                    {muted && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                            <div className="bg-black/40 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30">
                                    <VolumeX className="w-8 h-8 text-gold" />
                                </div>
                                <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Toque para Ativar Som</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
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

                {/* Quick Action Menus Below */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-white mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">Veja Outros Pratos</span>
                        <ChevronUp className="w-4 h-4 animate-bounce text-gray-500" />
                    </div>

                    {/* Horizontal Scroll Menu */}
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mask-linear-right">
                        {otherItems.map((other: any) => (
                            <motion.button
                                key={other.id}
                                onClick={() => navigate(`/v/${other.id}`)}
                                className="flex-shrink-0 w-32 h-20 relative rounded-xl overflow-hidden border border-white/10"
                                whileTap={{ scale: 0.95 }}
                            >
                                <img src={other.image} className="w-full h-full object-cover opacity-60" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-2 text-center">
                                    <span className="text-[8px] font-black text-white uppercase leading-tight line-clamp-2">{other.name}</span>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Fixed Primary Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                    <motion.button
                        onClick={() => handleOrder()}
                        className="h-16 bg-gradient-to-r from-gold via-flame to-ember rounded-2xl text-white font-black text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-flame/40"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ShoppingCart className="w-5 h-5 text-white" />
                        PEDIR AGORA
                    </motion.button>
                    <motion.button
                        onClick={() => handleCallWaiter()}
                        className="md:hidden h-16 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl text-white font-black text-[10px] tracking-[0.2em] flex items-center justify-center gap-3"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <PhoneCall className="w-5 h-5 text-gold" />
                        GARÇOM
                    </motion.button>
                </div>
            </div>

            {/* Bottom Safe Area */}
            <div className="h-[env(safe-area-inset-bottom)]" />
        </div >
    );
}
