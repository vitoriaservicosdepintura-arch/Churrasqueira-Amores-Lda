import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play,
    QrCode,
    Smartphone,
    ShoppingCart,
    PhoneCall,
    ArrowLeft,
    Search,
    X,
    Calendar,
    Clock,
    Users,
    UtensilsCrossed
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const stripHTML = (text: any) => {
    if (!text || typeof text !== 'string') return '';
    const cleanText = text.replace(/<[^>]*>?/gm, '');
    const doc = new DOMParser().parseFromString(cleanText, "text/html");
    return doc.documentElement.textContent || '';
};

const DEFAULT_CONFIG = {
    menuItems: [],
    contact: {
        phone: '351282798417',
        googleMapsUrl: "https://maps.google.com/?q=Cafe+Restaurante+Chave+D-Ouro+Odiaxere"
    }
};

export default function MenuVision() {
    const [config, setConfig] = useState<any>(DEFAULT_CONFIG);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [orderData, setOrderData] = useState({
        name: '',
        phone: '',
        date: '',
        time: '',
        people: 2,
        dishName: ''
    });
    const navigate = useNavigate();

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
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const categories: string[] = ['Todos', ...new Set((config.menuItems || []).map((m: any) => m.category || 'Outros'))] as string[];

    const filteredItems = (config.menuItems || []).filter((item: any) => {
        const matchesCategory = activeCategory === 'Todos' || item.category === activeCategory;
        const matchesSearch = (stripHTML(item.name)).toLowerCase().includes(searchTerm.toLowerCase()) ||
            (stripHTML(item.description)).toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleCallWaiter = (dishName?: string) => {
        const msg = dishName
            ? `Olá! Estou na mesa e preciso de assistência para o prato: *${dishName}*`
            : `Olá! Estou na mesa e gostaria de chamar um garçom.`;
        window.open(`https://wa.me/${config.contact?.phone || ''}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    const handleQuickOrder = (item: any) => {
        setOrderData({
            ...orderData,
            dishName: stripHTML(item.name)
        });
        setIsOrderModalOpen(true);
    };

    const submitOrder = async () => {
        const msg = `*NOVO PEDIDO - MENUVISION 360°*\n\n` +
            `👤 *Cliente:* ${orderData.name}\n` +
            `📱 *Telemóvel:* ${orderData.phone}\n` +
            `🥘 *Prato:* ${orderData.dishName}\n` +
            `🗓️ *Data:* ${orderData.date}\n` +
            `⏰ *Hora:* ${orderData.time}h\n` +
            `👥 *Pessoas:* ${orderData.people}\n\n` +
            `_Enviado via MenuVision Interactive_`;

        window.open(`https://wa.me/${config.contact?.phone || ''}?text=${encodeURIComponent(msg)}`, '_blank');
        setIsOrderModalOpen(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-deep flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-deep text-white font-sans selection:bg-gold/30">
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-flame/10 rounded-full blur-[120px]" />
                <div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] bg-ember/5 rounded-full blur-[100px]" />
            </div>

            <header className="relative z-20 pt-8 pb-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => {
                                    if (window.history.length > 1) {
                                        navigate(-1);
                                    } else {
                                        navigate('/');
                                    }
                                }}
                                className="md:hidden w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-white active:scale-90 transition-all shadow-lg shadow-gold/5"
                            >
                                <ArrowLeft className="w-6 h-6 text-gold" />
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="hidden md:flex items-center gap-2 text-gray-400 hover:text-gold transition-colors text-sm font-bold uppercase tracking-widest"
                            >
                                <UtensilsCrossed className="w-4 h-4" /> Voltar ao Cardápio
                            </button>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black leading-none text-white uppercase tracking-tighter">
                            MenuVision<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-flame to-ember drop-shadow-sm italic">360° Interactive</span>
                        </h1>
                        <p className="text-gray-400 max-w-lg text-sm md:text-base font-medium">
                            Explore os nossos pratos em alta definição com QR Codes dedicados. <br className="hidden md:block" />
                            A nova era de escolher o seu prato chegou!
                        </p>
                    </motion.div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-gold transition-colors" />
                            <input
                                type="text"
                                placeholder="Procurar prato..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-surface/50 backdrop-blur-xl border border-white/10 rounded-2xl pl-11 pr-6 py-4 text-sm outline-none focus:border-gold/50 transition-all w-full md:w-80 shadow-inner"
                            />
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mt-12 overflow-x-auto no-scrollbar pb-4 flex gap-3 px-1">
                    {categories.map((cat: string) => (
                        <motion.button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all shrink-0 border ${activeCategory === cat
                                ? 'bg-gradient-to-r from-gold to-flame border-transparent text-white shadow-[0_10px_20px_rgba(245,158,11,0.3)]'
                                : 'bg-surface/30 border-white/5 text-gray-400 hover:border-gold/20 hover:text-white'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {cat}
                        </motion.button>
                    ))}
                </div>
            </header>

            <main className="relative z-20 max-w-7xl mx-auto px-6 -mt-20 pb-40 scroll-smooth touch-pan-y">
                {filteredItems.length > 0 ? (
                    <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredItems.map((item: any, idx: number) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                                    className="group h-full"
                                >
                                    <div className="glass rounded-[2rem] border border-white/5 hover:border-gold/20 transition-all duration-500 overflow-hidden flex flex-col h-full shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:shadow-gold/5 group-hover:translate-y-[-8px]">
                                        <div
                                            className="relative h-64 overflow-hidden cursor-pointer group/media"
                                            onClick={() => navigate(item.videoUrl ? `/v/${item.id}` : `/item/${item.id}`)}
                                        >
                                            <img
                                                src={item.image}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover/media:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-deep via-transparent to-black/20" />

                                            {item.videoUrl && (
                                                <div className="absolute top-4 right-4 flex items-center justify-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                                                    <div className="w-2 h-2 rounded-full bg-gold animate-pulse shadow-[0_0_8px_rgba(245,158,11,1)]" />
                                                    <span className="text-[9px] font-black uppercase tracking-[0.1em] text-white">Live 360°</span>
                                                </div>
                                            )}

                                            {item.videoUrl && (
                                                <motion.div
                                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition-opacity duration-300"
                                                    initial={{ scale: 0.8 }}
                                                    whileInView={{ scale: 1 }}
                                                >
                                                    <div className="w-16 h-16 rounded-full bg-gold/20 backdrop-blur-md border border-gold/40 flex items-center justify-center">
                                                        <Play className="w-7 h-7 text-gold ml-1 fill-gold/20" />
                                                    </div>
                                                </motion.div>
                                            )}

                                            <div className="absolute bottom-4 right-4 bg-gradient-to-r from-gold to-flame px-4 py-2 rounded-2xl shadow-xl shadow-flame/30">
                                                <span className="text-lg font-black text-white">{item.price}</span>
                                            </div>

                                            <motion.div
                                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition-all duration-500 bg-black/40 backdrop-blur-sm"
                                            >
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-28 h-28 bg-white rounded-2xl p-2 shadow-2xl border-2 border-gold/30">
                                                        <img
                                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(`${window.location.origin}/v/${item.id}`)}`}
                                                            alt="Scan QR"
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-black text-white uppercase tracking-widest bg-gold/80 px-3 py-1 rounded-full whitespace-nowrap">
                                                        Vídeo: Sobre este Prato
                                                    </span>
                                                </div>
                                            </motion.div>
                                        </div>

                                        <div className="p-6 md:p-8 flex-1 flex flex-col">
                                            <h3
                                                className="text-xl md:text-2xl font-black mb-3 text-white group-hover:text-gold transition-colors duration-300"
                                                dangerouslySetInnerHTML={{ __html: item.name || '' }}
                                            />
                                            <p
                                                className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-1 group-hover:text-gray-300 transition-colors"
                                                dangerouslySetInnerHTML={{ __html: item.description || '' }}
                                            />

                                            <div className="grid grid-cols-2 md:grid-cols-1 gap-3 mt-auto">
                                                <motion.button
                                                    onClick={() => handleQuickOrder(item)}
                                                    className="px-4 py-3.5 bg-white text-deep font-black rounded-2xl text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-gold hover:text-white transition-all shadow-lg"
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                >
                                                    <ShoppingCart className="w-3.5 h-3.5" />
                                                    Pedir Prato
                                                </motion.button>
                                                <motion.button
                                                    onClick={() => handleCallWaiter(stripHTML(item.name))}
                                                    className="md:hidden px-4 py-3.5 bg-surface/80 border border-white/10 text-white font-black rounded-2xl text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-white/10 transition-all backdrop-blur-md"
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                >
                                                    <PhoneCall className="w-3.5 h-3.5 text-gold" />
                                                    Garçom
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-surface/50 rounded-full flex items-center justify-center mb-6 border border-white/5">
                            <QrCode className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Nenhum prato encontrado</h3>
                        <p className="text-gray-500">Tente mudar de categoria ou pesquisar outro termo.</p>
                        <button
                            onClick={() => { setActiveCategory('Todos'); setSearchTerm('') }}
                            className="mt-6 text-gold font-bold uppercase tracking-widest text-xs hover:underline"
                        >
                            Ver tudo novamente
                        </button>
                    </div>
                )}
            </main>

            <nav className="fixed bottom-0 inset-x-0 h-20 bg-deep/80 backdrop-blur-2xl border-t border-white/5 z-[100] px-6 md:hidden">
                <div className="h-full max-w-xl mx-auto flex items-center justify-between gap-4">
                    <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1 text-gray-400">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-[8px] font-black uppercase">Início</span>
                    </button>

                    <button onClick={() => handleCallWaiter()} className="flex-1 bg-gradient-to-r from-gold to-flame h-12 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-flame/20 px-4">
                        <PhoneCall className="w-4 h-4 text-white" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Chamar Garçom</span>
                    </button>

                    <button className="flex flex-col items-center gap-1 text-gray-400" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <QrCode className="w-5 h-5" />
                        <span className="text-[8px] font-black uppercase">Topo</span>
                    </button>
                </div>
                <div className="h-[env(safe-area-inset-bottom)]" />
            </nav>

            <AnimatePresence>
                {isOrderModalOpen && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOrderModalOpen(false)}
                            className="absolute inset-0 bg-deep/90 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg glass rounded-[2.5rem] border border-gold/20 overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 md:p-10">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <ShoppingCart className="w-4 h-4 text-gold" />
                                            <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">Finalizar Pedido</span>
                                        </div>
                                        <h2 className="text-2xl font-black text-white">{orderData.dishName}</h2>
                                    </div>
                                    <button onClick={() => setIsOrderModalOpen(false)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                                        <X className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-2">Seu Nome</label>
                                        <input
                                            placeholder="Ex: João Silva"
                                            className="w-full bg-surface/50 border border-white/5 rounded-2xl px-5 py-4 outline-none focus:border-gold/50 transition-all font-sans"
                                            value={orderData.name}
                                            onChange={e => setOrderData({ ...orderData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-2">Telemóvel</label>
                                            <input
                                                placeholder="9xx xxx xxx"
                                                className="w-full bg-surface/50 border border-white/5 rounded-2xl px-5 py-4 outline-none focus:border-gold/50 transition-all font-mono text-white"
                                                value={orderData.phone}
                                                onChange={e => setOrderData({ ...orderData, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-2">Pessoas</label>
                                            <div className="relative">
                                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                                <input
                                                    type="number"
                                                    className="w-full bg-surface/50 border border-white/5 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-gold/50 transition-all font-mono text-white"
                                                    value={orderData.people}
                                                    onChange={e => setOrderData({ ...orderData, people: parseInt(e.target.value) || 1 })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-2">Data</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                                <input
                                                    type="date"
                                                    className="w-full bg-surface/50 border border-white/5 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-gold/50 transition-all text-sm font-sans text-white placeholder-transparent"
                                                    onChange={e => setOrderData({ ...orderData, date: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-2">Hora</label>
                                            <div className="relative">
                                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                                <input
                                                    type="time"
                                                    className="w-full bg-surface/50 border border-white/5 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-gold/50 transition-all text-sm font-sans text-white placeholder-transparent"
                                                    onChange={e => setOrderData({ ...orderData, time: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <motion.button
                                    onClick={submitOrder}
                                    className="w-full mt-10 h-16 bg-gradient-to-r from-gold via-flame to-ember rounded-2xl text-white font-black text-sm tracking-[0.2em] shadow-xl shadow-flame/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
                                    whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(245,158,11,0.3)" }}
                                >
                                    CONFIRMAR VIA WHATSAPP
                                </motion.button>
                                <p className="text-[10px] text-center text-gray-500 mt-6 font-medium uppercase tracking-widest px-8 leading-relaxed">
                                    Ao clicar em confirmar, você será redirecionado para o WhatsApp da <span className="text-gold">Chave D'Ouro</span> para confirmação instantânea.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <footer className="relative bg-deep border-t border-white/5 pt-20 pb-32 md:pb-12 px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gold/20 to-ember/20 rounded-2xl flex items-center justify-center border border-gold/20">
                            <Smartphone className="w-6 h-6 text-gold" />
                        </div>
                        <div>
                            <h4 className="font-black text-xs uppercase tracking-widest text-white">MenuVision 360°</h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Powered by Antigravity AI</p>
                        </div>
                    </div>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">© {new Date().getFullYear()} Cafe Restaurante Chave D'Ouro</p>
                </div>
            </footer>
        </div>
    );
}
