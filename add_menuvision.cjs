const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
let adminCode = fs.readFileSync('src/Admin.tsx', 'utf8');

// 1. App.tsx changes
// Ensure we don't apply it multiple times
if (!appCode.includes('menuVision: [')) {
    const defaultInsert = `
  menuVision: [
    {
      id: 1,
      name: 'Frango Supremo',
      image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&h=400&fit=crop&q=80',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      ingredients: '1. Frango marinado na brasa\\n2. Molho Secreto da Casa\\n3. Ervas finas e Açafrão\\n4. Carvão Especial'
    }
  ],
`;
    appCode = appCode.replace('  gallery: [', defaultInsert + '  gallery: [');

    appCode = appCode.replace("{ label: 'Menu', href: '#menu' },", "{ label: 'Menu', href: '#menu' },\n  { label: 'MenuVision', href: '#menuvision' },");

    const MenuVisionComponent = `
/* â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• 
   MENUVISION
   â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â•  */

function MenuVision({ config }: { config: any }) {
  const [selectedVision, setSelectedVision] = useState<any>(null);

  const visions = config.menuVision || [];

  if (visions.length === 0) return null;

  return (
    <section id="menuvision" className="relative py-20 md:py-32 bg-deep/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center mb-16 md:mb-20">
          <span className="inline-block px-4 py-1.5 bg-flame/10 border border-flame/20 rounded-full text-flame text-xs font-bold tracking-wider uppercase mb-6 shadow-lg shadow-flame/10">
            A Experiência Visual
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
            Menu<span className="text-gradient-fire">Vision</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Descubra os detalhes dos nossos pratos em formato de vídeo e explore cada camada dos ingredientes selecionados.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {visions.map((v: any, i: number) => (
            <AnimatedSection key={v.id} delay={i * 0.1}>
              <motion.div
                onClick={() => setSelectedVision(v)}
                className="group relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer aspect-[4/3]"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img src={v.image} alt={v.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-16 h-16 rounded-full bg-deep/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 group-hover:scale-110 group-hover:bg-flame/80 transition-all shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                         <path d="M8 5v14l11-7z" />
                      </svg>
                   </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <h3 className="text-xl font-bold text-white drop-shadow-md">{v.name}</h3>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedVision && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-deep/95 backdrop-blur-xl"
            onClick={() => setSelectedVision(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedVision(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full md:w-3/5 bg-black relative flex items-center justify-center">
                 {selectedVision.videoUrl ? (
                    <video src={selectedVision.videoUrl} autoPlay controls className="w-full max-h-[50vh] md:max-h-full" />
                 ) : (
                    <div className="text-gray-500">Video Indisponível</div>
                 )}
              </div>

              <div className="w-full md:w-2/5 p-6 md:p-8 overflow-y-auto bg-gradient-to-br from-surface to-deep">
                <h3 className="text-2xl md:text-3xl font-black mb-6 text-white">{selectedVision.name}</h3>
                
                <div className="mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-gold mb-2 block">Camadas d'Ingredientes</span>
                  <div className="h-px w-12 bg-gold/50 mb-6"></div>
                </div>

                <div className="space-y-4">
                  {selectedVision.ingredients?.split('\\n').map((ing: string, i: number) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + (i * 0.1) }}
                      className="flex items-start gap-3 glass p-3 rounded-lg border border-white/5"
                    >
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-flame shrink-0 mt-0.5 border border-white/10">
                        {i + 1}
                      </div>
                      <p className="text-gray-300 text-sm">{ing.replace(/^\\d+\\.\\s*/, '')}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
`;

    appCode = appCode.replace('function Gallery({ config }', MenuVisionComponent + '\nfunction Gallery({ config }');
    appCode = appCode.replace('<Gallery config={config} />', '<MenuVision config={config} />\n        <Gallery config={config} />');
}

// 2. Admin.tsx changes
if (!adminCode.includes('menuVision: [')) {
    // Append menuVision default to DEFAULT_CONFIG here too
    const defaultAdminInsert = `
  menuVision: [
    {
      id: 1,
      name: 'Frango Supremo',
      image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&h=400&fit=crop&q=80',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      ingredients: '1. Frango marinado na brasa\\n2. Molho Secreto da Casa\\n3. Ervas finas e Açafrão\\n4. Carvão Especial'
    }
  ],
`;
    adminCode = adminCode.replace('  gallery: [', defaultAdminInsert + '  gallery: [');

    // Add section tab
    adminCode = adminCode.replace("'gallery', 'reviews'", "'gallery', 'menuvision', 'reviews'");

    // Replace the renderTabContent to handle "menuvision"
    const renderTabContentCode = `
      case 'menuvision':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
              <h3 className="text-xl font-bold">MenuVision (Fotos e Vídeos)</h3>
              <button
                onClick={() => setConfig({
                  ...config,
                  menuVision: [...(config.menuVision || []), { id: Date.now(), name: 'Novo Prato', image: '', videoUrl: '', ingredients: '1. Ingrediente' }]
                })}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg text-sm font-bold shadow-lg hover:shadow-emerald-500/25 transition-all text-white"
              >
                + Adicionar MenuVision
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(config.menuVision || []).map((v: any, index: number) => (
                <div key={v.id} className="p-4 glass rounded-xl space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-gray-500">#{index + 1}</span>
                    <button
                      onClick={() => setConfig({
                        ...config,
                        menuVision: config.menuVision.filter((_: any, i: number) => i !== index)
                      })}
                      className="p-1 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={v.name}
                    onChange={(e) => {
                      const newV = [...config.menuVision];
                      newV[index].name = e.target.value;
                      setConfig({ ...config, menuVision: newV });
                    }}
                    placeholder="Nome do Prato"
                    className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white"
                  />
                  <input
                    type="text"
                    value={v.image}
                    onChange={(e) => {
                      const newV = [...config.menuVision];
                      newV[index].image = e.target.value;
                      setConfig({ ...config, menuVision: newV });
                    }}
                    placeholder="URL da Imagem (Capa)"
                    className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white text-sm"
                  />
                  <input
                    type="text"
                    value={v.videoUrl}
                    onChange={(e) => {
                      const newV = [...config.menuVision];
                      newV[index].videoUrl = e.target.value;
                      setConfig({ ...config, menuVision: newV });
                    }}
                    placeholder="URL do Vídeo (.mp4)"
                    className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white text-sm"
                  />
                  <textarea
                    value={v.ingredients}
                    onChange={(e) => {
                      const newV = [...config.menuVision];
                      newV[index].ingredients = e.target.value;
                      setConfig({ ...config, menuVision: newV });
                    }}
                    rows={4}
                    placeholder="Ingredientes (um por linha usando Enter)"
                    className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white text-sm resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        );
`;

    if (!adminCode.includes("case 'menuvision':")) {
        adminCode = adminCode.replace("case 'gallery':", renderTabContentCode + "      case 'gallery':");
    }
}

fs.writeFileSync('src/App.tsx', appCode, 'utf8');
fs.writeFileSync('src/Admin.tsx', adminCode, 'utf8');
console.log('done');
