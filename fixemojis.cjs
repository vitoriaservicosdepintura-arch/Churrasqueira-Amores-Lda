const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

const replacements = [
    // The specific emoji sequences observed in the About section and elsewhere
    ['\u00f0\u0178\u0090\u2014', '\uD83C\uDF57'], // 🍗
    ['\u00f0\u0178\u00a5\u00a2', '\uD83E\uDD54'], // 🥔
    ['\u00f0\u0178\u0091\u00a8\u0022\u0020\u00f0\u0178\u0091\u00a9\u0022\u0020\u00f0\u0178\u0091\u00a7\u0022\u0020\u00f0\u0178\u0091\u00a6', '\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66'],
];

// Based on the debug_lines output from before:
// Line 71: â­ = \u00e2 \u00ad + \u0090 (invisible)
// Line 80: â ¤ï¸ = \u00e2 \u009d \u00a4 \u00ef \u00b8 \u008f
// Line 89: ðŸ¥— = \u00f0 \u0178 \u00a5 \u2014

// I'll use a broader approach: find any remaining garbled char and fix it
const broadFixList = [
    ['\u00e2\u00ad\u0090', '⭐'],
    ['\u00e2\u009d\u00a4\u00ef\u00b8\u008f', '❤️'],
    ['\u00f0\u0178\u00a5\u2014', '🥗'],
    ['\u00f0\u0178\u0090\u2014', '🍗'],
    ['\u00f0\u0178\u00a5\u00a2', '🥔'],
    ["'ðŸ —'", "'🍗'"],
    ["'ðŸ¥\"'", "'🥔'"],
    ["'ðŸ‘¨\" ðŸ‘©\" ðŸ‘§\" ðŸ‘¦'", "'👨‍👩‍👧‍👦'"],
];

for (const [from, to] of broadFixList) {
    c = c.split(from).join(to);
}

fs.writeFileSync('src/App.tsx', c, 'utf8');
console.log('App.tsx final emoji fix complete.');
