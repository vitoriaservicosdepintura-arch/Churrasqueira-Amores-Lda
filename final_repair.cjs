const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

// Use regex to find and replace blocks that are definitely corrupted
// Filter by line content around the corruption

// 1. Footer Info
c = c.replace(/info: \[\n\s*'.*N125 n°66c, Odiáxere',\n\s*'.* 282 798 417',\n\s*'.* 10 .* 15€ por pessoa',\n\s*'.* 4.5 \/ 5 \(329 avaliações\)'\n\s*\]/g,
    `info: [
      '📍 N125 n°66c, Odiáxere',
      '📞 282 798 417',
      '💰 10 — 15€ por pessoa',
      '⭐ 4.5 / 5 (329 avaliações)'
    ]`);

// 2. Footer Services
c = c.replace(/services: \[\n\s*'.* Comer no local',\n\s*'.* Take away',\n\s*'.* Entrega ao domicílio',\n\s*'.* Reservas por telefone'\n\s*\]/g,
    `services: [
      '🍽️ Comer no local',
      '🥡 Take away',
      '🛵 Entrega ao domicílio',
      '📞 Reservas por telefone'
    ]`);

// 3. About Section Tags
c = c.replace(/icon: '.*', text: 'Frango na Brasa'/g, "icon: '🍗', text: 'Frango na Brasa'");
c = c.replace(/icon: '.*', text: 'Batatas Caseiras'/g, "icon: '🥔', text: 'Batatas Caseiras'");
c = c.replace(/icon: '.*', text: 'Ambiente Familiar'/g, "icon: '👨‍👩‍👧‍👦', text: 'Ambiente Familiar'");

// 4. Reservar buttons
c = c.replace(/>\s*.* Reservar\s*<\/motion\.button>/g, "> 📞 Reservar </motion.button>");
c = c.replace(/>\s*.* Reservar Agora\s*<\/button>/g, "> 📞 Reservar Agora </button>");

// 5. Bottom Nav
c = c.replace(/text-xl\">.*<\/div>\s*<span className=\"text-\[9px\] font-black uppercase tracking-tighter opacity-80\">Início<\/span>/g, 'text-xl\">🏠</div>\n          <span className=\"text-[9px] font-black uppercase tracking-tighter opacity-80\">Início</span>');
c = c.replace(/text-xl\">.*<\/div>\s*<span className=\"text-\[9px\] font-black uppercase tracking-tighter opacity-80\">Menu<\/span>/g, 'text-xl\">🍽</div>\n          <span className=\"text-[9px] font-black uppercase tracking-tighter opacity-80\">Menu</span>');
c = c.replace(/text-xl\">.*<\/div>\s*<span className=\"text-\[9px\] font-black uppercase tracking-tighter opacity-80\">Local<\/span>/g, 'text-xl\">📍</div>\n          <span className=\"text-[9px] font-black uppercase tracking-tighter opacity-80\">Local</span>');
c = c.replace(/text-xl\">.*<\/div>\s*<span className=\"text-\[9px\] font-black uppercase tracking-tighter opacity-80\">Admin<\/span>/g, 'text-xl\">⚙️</div>\n          <span className=\"text-[9px] font-black uppercase tracking-tighter opacity-80\">Admin</span>');

fs.writeFileSync('src/App.tsx', c, 'utf8');
console.log('App.tsx final structural repair complete.');
