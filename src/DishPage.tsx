import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabase';
import { motion } from 'framer-motion';
import { ArrowLeft, ChefHat, Info, ShoppingCart, UtensilsCrossed, Volume2, VolumeX } from 'lucide-react';

const stripHTML = (text: any) => {
    if (!text || typeof text !== 'string') return '';
    const cleanText = text.replace(/<[^>]*>?/gm, '');
    const doc = new DOMParser().parseFromString(cleanText, "text/html");
    return doc.documentElement.textContent || '';
};

export default function DishPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [config, setConfig] = useState<any>(null);
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [muted, setMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
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


    // Split description into bullets if possible, or just use it as is
    const ingredients = item.description?.split(',').map((i: string) => i.trim()) || [];

    return (
        <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
            {/* Split Layout: Video Top, Content Bottom */}
            <div className="flex flex-col min-h-screen">

                {/* Visual Area - Fixed or Top Scrolled */}
                <div className="relative w-full aspect-[9/16] md:aspect-video bg-black overflow-hidden shadow-2xl">
                    {item.videoUrl ? (
                        <video
                            ref={videoRef}
                            src={item.videoUrl}
                            autoPlay
                            loop
                            muted={muted}
                            playsInline
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <img
                            src={item.image}
                            className="w-full h-full object-cover"
                            alt={stripHTML(item.name)}
                        />
                    )}

                    {/* Mute Toggle on Video */}
                    {item.videoUrl && (
                        <>
                            <button
                                onClick={() => setMuted(!muted)}
                                className="absolute bottom-12 right-6 w-12 h-12 glass rounded-full flex items-center justify-center text-white z-20 shadow-xl border border-white/20"
                            >
                                {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </button>

                            {/* Play/Pause Overlay */}
                            {!isPlaying && (
                                <button
                                    onClick={() => {
                                        videoRef.current?.play();
                                        setIsPlaying(true);
                                    }}
                                    className="absolute inset-0 flex items-center justify-center bg-black/20 z-10"
                                >
                                    <div className="w-20 h-20 rounded-full bg-gold/20 backdrop-blur-md border border-gold/50 flex items-center justify-center">
                                        <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-gold border-b-[15px] border-b-transparent ml-2" />
                                    </div>
                                </button>
                            )}

                            <div
                                className="absolute inset-0 z-0"
                                onClick={() => {
                                    if (videoRef.current?.paused) {
                                        videoRef.current.play();
                                        setIsPlaying(true);
                                    } else {
                                        videoRef.current?.pause();
                                        setIsPlaying(false);
                                    }
                                }}
                            />
                        </>
                    )}

                    {/* Gradient Fade to Content */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
                </div>

                {/* Content Area - Slides up over the video slightly */}
                <div className="relative z-20 -mt-8 bg-black rounded-t-[3rem] border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] pb-32">
                    <div className="p-8 max-w-2xl mx-auto">
                        {/* Header Info */}
                        <div className="flex justify-between items-start mb-8">
                            <div className="space-y-2">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black uppercase tracking-widest"
                                >
                                    <UtensilsCrossed className="w-3.5 h-3.5" />
                                    Experiência Gourmet
                                </motion.div>
                                <motion.h1
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-4xl md:text-5xl font-black text-white leading-[1.1]"
                                    dangerouslySetInnerHTML={{ __html: item.name || '' }}
                                />
                            </div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-right"
                            >
                                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold to-flame drop-shadow-lg">
                                    {item.price}
                                </div>
                            </motion.div>
                        </div>

                        {/* Description & Ingredients */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-8"
                        >
                            <div className="glass rounded-3xl p-6 border border-white/10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-gold/10 transition-colors" />

                                <h3 className="text-gold text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <Info className="w-4 h-4" /> Sobre este Prato
                                </h3>
                                <p
                                    className="text-gray-300 text-lg leading-relaxed font-medium mb-6"
                                    dangerouslySetInnerHTML={{ __html: item.description || "Uma seleção exclusiva de ingredientes frescos preparados com maestria na nossa brasa tradicional." }}
                                />

                                <div className="grid grid-cols-2 gap-3">
                                    {ingredients.map((ing: string, i: number) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 p-3 rounded-xl border border-white/5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                                            {ing}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Chef's Note or Tag */}
                            {item.tag && (
                                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-deep to-surface rounded-2xl border border-white/5">
                                    <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-2xl">
                                        ✨
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-gold uppercase tracking-widest">Destaque da Casa</div>
                                        <div className="text-sm font-bold text-gray-200">{item.tag}</div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Sticky Actions Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 p-6 bg-gradient-to-t from-black via-black/90 to-transparent">
                <div className="max-w-xl mx-auto grid grid-cols-5 gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="col-span-1 h-14 glass rounded-2xl flex items-center justify-center text-white active:scale-90 transition-transform shadow-xl border border-white/10"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={() => navigate(`/?reserve=${encodeURIComponent(`${stripHTML(item.name)} - ${item.price}`)}`)}
                        className="col-span-3 md:col-span-4 h-14 bg-gradient-to-r from-gold via-flame to-ember rounded-2xl text-white font-black text-sm tracking-widest shadow-[0_15px_35px_rgba(249,115,22,0.4)] active:scale-95 transition-transform flex items-center justify-center gap-3"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        PEDIR AGORA
                    </button>

                    <button
                        onClick={() => window.open(`https://wa.me/${config?.contact?.phone || ''}?text=${encodeURIComponent(`Olá, estou na mesa e gostaria de chamar um garçom para o prato: ${stripHTML(item.name)}`)}`, '_blank')}
                        className="col-span-1 md:hidden flex-col h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white active:scale-90 transition-transform backdrop-blur-md"
                    >
                        <ChefHat className="w-5 h-5 mb-0.5" />
                        <span className="text-[7.5px] font-black uppercase tracking-wider text-gray-400 pointer-events-none leading-none">Garçom</span>
                    </button>
                </div>
            </div>

            {/* Safe Area Padding for Mobile Browsers */}
            <div className="h-[env(safe-area-inset-bottom)] bg-black" />
        </div>
    );
}
