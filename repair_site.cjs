const fs = require('fs');

const replacements = [
    // Branding & Typos
    [/Churrasqueira Amores/g, "Chave D'Ouro Café"],
    [/CHURRASQUEIRA AMORES/g, "CHAVE D'OURO CAFÉ"],
    [/CHAVE D\u00B4DOURO/g, "CHAVE D'OURO"], // Fix extra D and use '
    [/CHAVE D\xB4OURO/g, "CHAVE D'OURO"],
    [/&nbsp;/g, ' '],

    // Encoding Fixes (Commonly observed garbled patterns)
    [/\u00f0\u0178\u201d\u017e/g, '\uD83D\uDCDE'], // ðŸ“ž -> 📞
    [/\u00e2\u02dc\u2026/g, '\u2605'],             // â˜… -> ★
    [/\u00f0\u0178\u0090\u2014/g, '\uD83C\uDF57'], // ðŸ — -> 🍗
    [/\u00f0\u0178\u0091\u00a8\u0022\u0020\u00f0\u0178\u0091\u00a9\u0022\u0020\u00f0\u0178\u0091\u00a7\u0022\u0020\u00f0\u0178\u0091\u00a6/g, '\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66'], // Family
    [/\u00f0\u0178\u00bd\u00ef\u00b8\u008f/g, '\uD83C\uDF7D\uFE0F'], // ðŸ ½ï¸  -> 🍽️
    [/\u00f0\u0178\u00bd/g, '\uD83C\uDF7D'],       // ðŸ ½ -> 🍽
    [/\u00f0\u0178\u203a\u00b5/g, '\uD83D\uDEF5'], // ðŸ›µ -> 🛵
    [/\u00f0\u0178\u201d\u00b1/g, '\uD83D\uDCF1'], // ðŸ“± -> 📱
    [/\u00f0\u0178\u201d\u00a7/g, '\uD83D\uDCE7'], // ðŸ“§ -> 📧
    [/\u00f0\u0178\u201d\u008d/g, '\uD83D\uDCCD'], // ðŸ“  -> 📍
    [/\u00f0\u0178\u201d\u00b8/g, '\uD83D\uDCF8'], // ðŸ“¸ -> 📸
    [/\u00e2\u20ac\u201d/g, '\u2014'],             // Corrupted em-dash
    [/\u201D\u00A2/g, '\u2022'],                   // ”¢ -> •
    [/\u201D\u201D/g, '\u2014'],                   // ”” -> —
];

function repairFile(path) {
    let content = fs.readFileSync(path, 'utf8');
    let count = 0;
    replacements.forEach(([regex, to]) => {
        const before = content;
        content = content.replace(regex, to);
        if (content !== before) {
            count++;
        }
    });

    // Ensure all "Chave D'Ouro Café" substrings in single-quoted strings are converted to double-quoted
    const quotingRegex = /'([^'\n]*Chave D'Ouro Café[^'\n]*)'/g;
    content = content.replace(quotingRegex, (match, inner) => {
        count++;
        return `"${inner}"`;
    });

    fs.writeFileSync(path, content, 'utf8');
    console.log(`Repaired ${path} (${count} types of fixes applied)`);
}

repairFile('src/App.tsx');
repairFile('src/Admin.tsx');
console.log('Global repair complete.');
