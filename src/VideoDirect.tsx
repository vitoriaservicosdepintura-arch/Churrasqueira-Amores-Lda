import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
    VolumeX,
    ShoppingCart,
    PhoneCall,
    ArrowLeft,
    Info
} from 'lucide-react';

export default function VideoDirect() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [muted, setMuted] = useState(true);
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

                if (data?.config?.menuItems) {
                    const found = data.config.menuItems.find((m: any) => m.id.toString() === id);
                    if (found) setItem(found);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadItem();
    }, [id]);

    const handleCallWaiter = () => {
        const phone = '351282798417';
        const msg = `Olá! Estou vendo o vídeo do prato *${item?.name}* e gostaria de assistência na mesa.`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    const handleOrder = () => {
        const phone = '351282798417';
        const msg = `Olá! Acabei de ver o vídeo imersivo do prato *${item?.name}* e quero fazer um pedido agora!`;
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
                <button onClick={() => navigate('/')} className="px-6 py-2 bg-gold text-black rounded-full font-bold">Voltar</button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black h-screen w-screen overflow-hidden font-sans">
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

            {/* Dark Overlays for controls visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 w-12 h-12 glass rounded-full flex items-center justify-center text-white z-50 border border-white/10"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Top Badge */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-40 bg-gold/20 backdrop-blur-md border border-gold/40 px-4 py-1.5 rounded-full">
                <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">MenuVision 360°</span>
            </div>

            {/* Main Action Area (Center Tap) */}
            <div
                className="absolute inset-0 z-10 flex items-center justify-center"
                onClick={() => setMuted(!muted)}
            >
                {muted && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-black/40 backdrop-blur-xl border border-white/20 p-6 rounded-3xl flex flex-col items-center gap-3"
                    >
                        <VolumeX className="w-12 h-12 text-white opacity-80" />
                        <span className="text-white text-xs font-black uppercase tracking-widest">Toque para Som</span>
                    </motion.div>
                )}
            </div>

            {/* Details & Actions Footer */}
            <div className="absolute bottom-0 inset-x-0 z-40 p-6 space-y-4">
                <div className="flex items-end justify-between gap-4 mb-2">
                    <div className="flex-1">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl font-black text-white drop-shadow-2xl mb-1"
                        >
                            {item.name}
                        </motion.h1>
                        <div className="text-gold font-black text-2xl drop-shadow-lg">{item.price}</div>
                    </div>

                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-white border border-white/10"
                    >
                        <Info className="w-6 h-6" />
                    </button>
                </div>

                {/* Main Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={handleOrder}
                        className="h-16 bg-gradient-to-r from-gold via-flame to-ember rounded-2xl text-white font-black text-sm tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-flame/30 active:scale-95 transition-transform"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        PEDIR AGORA
                    </button>
                    <button
                        onClick={handleCallWaiter}
                        className="h-16 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl text-white font-black text-sm tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-transform"
                    >
                        <PhoneCall className="w-5 h-5 text-gold" />
                        GARÇOM
                    </button>
                </div>
            </div>

            {/* Details Overlay Panel */}
            <AnimatePresence>
                {showDetails && (
                    <motion.div
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "100%" }}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl p-8 flex flex-col justify-end"
                        onClick={() => setShowDetails(false)}
                    >
                        <div className="space-y-6 max-w-lg mx-auto w-full">
                            <div className="w-20 h-1 bg-white/20 rounded-full mx-auto mb-4" />
                            <h2 className="text-2xl font-black text-gold uppercase tracking-widest">Detalhes do Prato</h2>
                            <p className="text-gray-300 text-lg italic leading-relaxed">
                                {item.description}
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {item.category && (
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                        <div className="text-[10px] text-gray-500 font-black uppercase mb-1">Categoria</div>
                                        <div className="text-white font-bold">{item.category}</div>
                                    </div>
                                )}
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                    <div className="text-[10px] text-gray-500 font-black uppercase mb-1">Exclusividade</div>
                                    <div className="text-white font-bold">Chave D'Ouro</div>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-white/10 rounded-2xl text-white font-bold uppercase tracking-widest text-xs">Voltar ao Vídeo</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Home Indicator Buffer */}
            <div className="h-[env(safe-area-inset-bottom)]" />
        </div>
    );
}
