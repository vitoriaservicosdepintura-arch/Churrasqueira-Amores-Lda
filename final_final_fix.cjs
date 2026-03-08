const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(/<span className=\"text-gold\">.*<\/span> Informações/g, '<span className=\"text-gold\">ℹ️</span> Informações');

fs.writeFileSync('src/App.tsx', c, 'utf8');
console.log('Very final fix applied.');
