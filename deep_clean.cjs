const fs = require('fs');

const fullFixMap = {
    "ðŸ“ ": "📍",
    "ðŸ• ": "🕒",
    "âš ï¸ ": "⚠️",
    "ðŸ“±": "📱",
    "ðŸ“˜": "📘",
    "ðŸ“§": "📧",
    "ðŸ§\u00AD": "🧭", // ðŸ§­
    "â„¹ï¸ ": "ℹ️",
    "ðŸ ½ï¸ ": "🍽️",
    "ðŸ“ž": "📞",
    "âœ\u0093": "✓", // âœ“
    "â˜\u2026": "★",
    "ðŸ —": "🍗",
    "ðŸ¥\"": "🥔",
    "ðŸ‘\u00A8\" ðŸ‘\u00A9\" ðŸ‘\u00A7\" ðŸ‘\u00A6": "👨‍👩‍👧‍👦",
    "ðŸ ´": "🍽",
    "ðŸ  ": "🏠",
    "ðŸ’\u00B0": "💰",
    "ðŸ›\u00B5": "🛵",
    "ðŸ¥¡": "🥡",
    "âš\u2122ï¸ ": "⚙️",
    " ”” ": " — ",
    " ”“ ": " — ",
    " \"“ ": " — ",
    "\"“": "—",
    "””": "—",
    "CHURRASQUEIRA AMORES": "CHAVE D'OURO CAFÉ",
    "Churrasqueira Amores": "Chave D'Ouro Café",
    "CHAVE D\u00B4DOURO": "CHAVE D'OURO",
    "D\u00B4OURO": "D'OURO",
    "&nbsp;": " ",
    "?q=Churrasqueira+Amores+Odiaxere": "?q=Cafe+Restaurante+Chave+D-Ouro+Odiaxere"
};

function deepClean(path) {
    let content = fs.readFileSync(path, 'utf8');
    let count = 0;

    for (const [from, to] of Object.entries(fullFixMap)) {
        if (content.includes(from)) {
            let parts = content.split(from);
            count += (parts.length - 1);
            content = parts.join(to);
        }
    }

    // Final check for the typo "CHAVE D´DOURO" (with any accented char in between)
    const typoRegex = /CHAVE D[^\x20-\x7E]DOURO/g;
    if (typoRegex.test(content)) {
        content = content.replace(typoRegex, "CHAVE D'OURO");
        count++;
    }

    fs.writeFileSync(path, content, 'utf8');
    console.log(`Deep cleaned ${path} (${count} fixes applied)`);
}

deepClean('src/App.tsx');
deepClean('src/Admin.tsx');
console.log('Final deep cleanup complete.');
