import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabase';
import { motion } from 'framer-motion';
import { ArrowLeft, ChefHat, Info, ShoppingCart, UtensilsCrossed, Volume2, VolumeX } from 'lucide-react';

export default function DishPage() {
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

    if (!item) {
        return (
            <div className="min-h-screen bg-deep flex flex-col items-center justify-center p-6 text-center">
                <ChefHat className="w-16 h-16 text-gray-700 mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">Prato não encontrado</h1>
                <p className="text-gray-400 mb-8">O código que escaneou pode estar desatualizado.</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-8 py-3 bg-gradient-to-r from-gold to-flame rounded-full text-white font-bold"
                >
                    Voltar ao Início
                </button>
            </div>
        );
    }

    const [showInfo, setShowInfo] = useState(true);

    // Split description into bullets if possible, or just use it as is
    const ingredients = item.description?.split(',').map((i: string) => i.trim()) || [];

    return (
        <div className="relative h-screen w-screen bg-black text-white font-sans overflow-hidden">
            {/* Background Video - Pure Experience */}
            <div
                className="absolute inset-0 z-0 cursor-pointer"
                onClick={() => setShowInfo(!showInfo)}
            >
                {item.videoUrl ? (
                    <video
                        ref={videoRef}
                        src={item.videoUrl}
                        autoPlay
                        loop
                        muted={muted}
                        playsInline
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <img
                        src={item.image}
                        className="w-full h-full object-cover"
                        alt={item.name}
                    />
                )}

                {/* Dynamic Overlays based on UI visibility */}
                <AnimatePresence>
                    {showInfo && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"
                            />
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* Top Navigation - Back & Mute */}
            <div className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-center pointer-events-none">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 glass rounded-full flex items-center justify-center text-white active:scale-90 transition-transform pointer-events-auto shadow-lg"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                {item.videoUrl && (
                    <button
                        onClick={() => setMuted(!muted)}
                        className="w-10 h-10 glass rounded-full flex items-center justify-center text-white active:scale-90 transition-transform pointer-events-auto shadow-lg"
                    >
                        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                )}
            </div>

            {/* Floating Visual Experience Overlay */}
            <AnimatePresence>
                {showInfo && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="absolute inset-x-0 bottom-0 z-10 p-6 pb-safe-bottom"
                    >
                        <div className="max-w-xl mx-auto">
                            {/* Short Intro Title & Price */}
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-gold/20 border border-gold/30 rounded-full text-gold text-[8px] font-black uppercase tracking-widest mb-2 backdrop-blur-sm">
                                        <UtensilsCrossed className="w-3 h-3" />
                                        Sugestão
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl leading-none">
                                        {item.name}
                                    </h1>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-black text-gold drop-shadow-[0_4px_10px_rgba(245,158,11,0.5)]">
                                        {item.price}
                                    </div>
                                </div>
                            </div>

                            {/* Transparent Info Card - Minimal and Bottom-Focused */}
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 mb-6 border border-white/10">
                                <div className="flex items-center gap-2 text-gold/80 font-bold text-[10px] uppercase tracking-widest mb-3">
                                    <Info className="w-3.5 h-3.5" />
                                    Descrição e Ingredientes
                                </div>

                                <p className="text-sm text-gray-200 mb-3 font-medium leading-relaxed">
                                    {item.description || "Uma experiência gastronômica única preparada na brasa."}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {ingredients.slice(0, 4).map((ing: string, i: number) => (
                                        <span key={i} className="px-2 py-1 bg-white/5 rounded-md text-[10px] text-gray-400 border border-white/5">
                                            • {ing}
                                        </span>
                                    ))}
                                    {ingredients.length > 4 && (
                                        <span className="text-[10px] text-gold/60 font-bold self-center">+{ingredients.length - 4} mais</span>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-4 gap-3">
                                <button
                                    onClick={() => (window as any).openReservationModal?.(item.name, item.price)}
                                    className="col-span-3 flex items-center justify-center gap-3 bg-gradient-to-r from-gold via-flame to-ember h-14 rounded-2xl text-white font-black text-base shadow-[0_10px_30px_rgba(249,115,22,0.4)] active:scale-95 transition-transform"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    FAZER PEDIDO
                                </button>
                                <button
                                    onClick={() => window.open(`https://wa.me/${config?.contact?.phone || ''}?text=${encodeURIComponent(`Olá, estou na mesa e gostaria de chamar um garçom para o prato: ${item.name}`)}`, '_blank')}
                                    className="col-span-1 flex items-center justify-center bg-white/10 border border-white/20 h-14 rounded-2xl text-white active:scale-95 transition-transform backdrop-blur-md"
                                    title="Chamar Garçom"
                                >
                                    <ChefHat className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tap Hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.4, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-white/20 text-xs font-bold uppercase tracking-widest hidden md:block"
            >
                Toque no vídeo para ocultar/ver info
            </motion.div>

            <style>{`
                .pb-safe-bottom {
                    padding-bottom: max(1.5rem, env(safe-area-inset-bottom));
                }
            `}</style>
        </div>
    );
}
