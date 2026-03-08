const fs = require('fs');

const fixMap = {
    // Branding & Typos
    "Churrasqueira Amores": "Chave D'Ouro Café",
    "CHURRASQUEIRA AMORES": "CHAVE D'OURO CAFÉ",
    "CHAVE D\u00B4DOURO": "CHAVE D'OURO",
    "CHAVE D\u00B4OURO": "CHAVE D'OURO",
    "D\u00B4OURO": "D'OURO",
    "&nbsp;": " ",

    // Garbled Punctuation
    ' "“ ': ' — ',
    ' "“': ' —',
    '"“': '—',
    ' ”” ': ' — ',

    // Emojis (Specific garbled sequences from App.tsx)
    "\u00F0\u0178\u0093\u009E": "📞", // ðŸ“ž
    "\u00F0\u0178\u0093\u00A1": "📍", // ðŸ“ 
    "\u00F0\u0178\u0092\u00B0": "💰", // ðŸ’°
    "\u00F0\u0178\u0090\u2014": "🍗", // ðŸ —
    "\u00F0\u0178\u00A5\u00A2": "🥔", // ðŸ¥"
    "\u00F0\u0178\u00BD\u00EF\u00B8\u008F": "🍽️", // ðŸ ½ï¸ 
    "\u00F0\u0178\u00BD": "🍽",       // ðŸ ½
    "\u00F0\u0178\u203A\u00B5": "🛵", // ðŸ›µ
    "\u00F0\u0178\u00A5\u00A1": "🥡", // ðŸ¥¡
    "\u00F0\u0178\u00A0": "🏠",      // ðŸ  
    "\u00F0\u0178\u00B4": "🍽",      // ðŸ ´
    "\u00E2\u0161\u2019\u00EF\u00B8\u008F": "⚙️", // âš™ï¸ 
    "â˜…": "★",
    "ðŸ ´": "🍽",
    "ðŸ  ": "🏠",
    "ðŸ“ ": "📍",
    "ðŸ“ž": "📞",
    "ðŸ’°": "💰",
    "ðŸ ½ï¸ ": "🍽️",
    "ðŸ ½": "🍽",
    "ðŸ›µ": "🛵",
    "ðŸ¥¡": "🥡",
    "âš™ï¸ ": "⚙️",
};

function fixFile(path) {
    let content = fs.readFileSync(path, 'utf8');
    let count = 0;

    // First, do literal string replacements from our map
    for (const [from, to] of Object.entries(fixMap)) {
        let parts = content.split(from);
        if (parts.length > 1) {
            count += (parts.length - 1);
            content = parts.join(to);
        }
    }

    // Handle quoting for branding
    const branding = "Chave D'Ouro Café";
    const quoterRegex = /'([^'\n]*Chave D'Ouro Café[^'\n]*)'/g;
    content = content.replace(quoterRegex, (match, inner) => {
        count++;
        return `"${inner}"`;
    });

    // Specifically fix CHAVE D´DOURO if it escaped earlier
    content = content.replace(/CHAVE D[^\x00-\x7F]*DOURO/g, "CHAVE D'OURO");

    fs.writeFileSync(path, content, 'utf8');
    console.log(`Surgically repaired ${path} (${count} fixes)`);
}

fixFile('src/App.tsx');
fixFile('src/Admin.tsx');
console.log('Repair complete.');
