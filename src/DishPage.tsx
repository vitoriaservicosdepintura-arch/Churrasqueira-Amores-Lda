import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabase';
import { motion, AnimatePresence } from 'framer-motion';
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
                    .from('site_config')
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

    // Split description into bullets if possible, or just use it as is
    const ingredients = item.description?.split(',').map((i: string) => i.trim()) || [];

    return (
        <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
            {/* Background Video - Video Hero Experience */}
            <div className="absolute inset-0 z-0">
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
                        className="w-full h-full object-cover blur-sm opacity-50"
                        alt={item.name}
                    />
                )}
                {/* Immersive Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
            </div>

            {/* Top Navigation */}
            <div className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                <button
                    onClick={() => navigate(-1)}
                    className="w-12 h-12 glass rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                {item.videoUrl && (
                    <button
                        onClick={() => setMuted(!muted)}
                        className="w-12 h-12 glass rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
                    >
                        {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                )}
            </div>

            {/* Bottom Content / Dish Info */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-6 pb-12 max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/20 border border-gold/30 rounded-full text-gold text-[10px] font-bold uppercase tracking-widest mb-4">
                        <UtensilsCrossed className="w-3 h-3" />
                        Sugestão do Chef
                    </div>

                    {/* Name & Price */}
                    <div className="flex justify-between items-end mb-4">
                        <div className="flex-1 mr-4">
                            <h1 className="text-4xl md:text-5xl font-black leading-tight text-white mb-2 drop-shadow-2xl">
                                {item.name}
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-bold text-gray-300">
                                    {item.category}
                                </span>
                                {item.tag && (
                                    <span className="text-gold text-xs font-bold drop-shadow-lg">
                                        {item.tag}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <span className="block text-3xl font-black text-gold drop-shadow-lg">
                                {item.price}
                            </span>
                        </div>
                    </div>

                    {/* Ingredients / Experience */}
                    <div className="glass-morphism rounded-3xl p-6 mb-8 border border-white/10 backdrop-blur-xl">
                        <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-widest mb-4">
                            <Info className="w-4 h-4" />
                            Ingredientes Selecionados
                        </div>
                        <ul className="grid grid-cols-2 gap-y-3 gap-x-4">
                            {ingredients.map((ing: string, i: number) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + (i * 0.1) }}
                                    className="flex items-center gap-2 text-sm text-gray-200"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                                    {ing}
                                </motion.li>
                            ))}
                        </ul>

                        <div className="mt-6 pt-6 border-t border-white/5">
                            <p className="text-sm text-gray-400 italic leading-relaxed">
                                "Uma explosão de sabores tradicionais, preparada com maestria em brasa lenta para garantir a textura perfeita."
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => (window as any).openReservationModal?.(item.name, item.price)}
                            className="flex-[3] flex items-center justify-center gap-3 bg-gradient-to-r from-gold via-flame to-ember h-14 md:h-16 rounded-2xl text-white font-black text-sm md:text-lg shadow-[0_10px_30px_rgba(249,115,22,0.4)] active:scale-95 transition-transform"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            PEDIR
                        </button>
                        <button
                            onClick={() => window.open(`https://wa.me/${config?.contact?.phone || ''}?text=${encodeURIComponent(`Olá, estou na mesa e gostaria de chamar um garçom para o prato: ${item.name}`)}`, '_blank')}
                            className="flex-1 flex items-center justify-center gap-3 bg-white/10 border border-white/20 h-14 md:h-16 rounded-2xl text-white font-bold text-[10px] md:text-sm active:scale-95 transition-transform backdrop-blur-md"
                        >
                            GARÇOM
                        </button>
                    </div>
                </motion.div>
            </div>

            <style>{`
                .glass-morphism {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
                }
            `}</style>
        </div>
    );
}
