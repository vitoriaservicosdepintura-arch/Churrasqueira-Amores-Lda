import { readFileSync, writeFileSync } from 'fs';

let content = readFileSync('src/App.tsx', 'utf8');
let before = (content.match(/Ã|Â[\xA0-\xFF]|ðŸ|â€|ï¿½/g) || []).length;

// Fix double-encoded UTF-8 - Portuguese accented chars
const fixList = [
    ['Ã¡', 'á'], ['Ã ', 'à'], ['Ã¢', 'â'], ['Ã£', 'ã'], ['Ã¤', 'ä'],
    ['Ã©', 'é'], ['Ã¨', 'è'], ['Ãª', 'ê'], ['Ã«', 'ë'],
    ['Ã­', 'í'], ['Ã¬', 'ì'], ['Ã®', 'î'], ['Ã¯', 'ï'],
    ['Ã³', 'ó'], ['Ã²', 'ò'], ['Ã´', 'ô'], ['Ãµ', 'õ'], ['Ã¶', 'ö'],
    ['Ãº', 'ú'], ['Ã¹', 'ù'], ['Ã»', 'û'], ['Ã¼', 'ü'],
    ['Ã§', 'ç'], ['Ã±', 'ñ'],
    ['Ã‰', 'É'], ['Ãˆ', 'È'],
    ['Ã‡', 'Ç'],
    // Special chars
    ['â€™', "'"], ['â€˜', "'"],
    ['â€"', '\u2014'], ['â€"', '\u2013'], ['â€¦', '\u2026'],
    ['â€¢', '\u2022'],
    ['â€œ', '\u201C'], ['â€', '\u201D'],
    ['Â·', '\u00B7'], ['Â°', '\u00B0'],
    ['Â©', '\u00A9'], ['Â®', '\u00AE'],
    ['â†'', '\u2192'], ['â†'', '\u2190'],
    ['âœ"', '\u2713'], ['âœ"', '\u2714'],
    ['â˜…', '\u2605'], ['â˜†', '\u2606'],
    ['â‚¬', '\u20AC'],
    ['Â«', '\u00AB'], ['Â»', '\u00BB'],
    // Emojis
    ['ðŸ"¥', '\uD83D\uDD25'], ['ðŸ—', '\uD83C\uDF57'], ['ðŸ¥"', '\uD83E\uDD54'],
    ['ðŸ"ž', '\uD83D\uDCDE'], ['ðŸ"±', '\uD83D\uDCF1'], ['ðŸ"§', '\uD83D\uDCE7'],
    ['ðŸ"', '\uD83D\uDCCD'], ['ðŸ—"ï¸', '\uD83D\uDDD3\uFE0F'], ['ðŸ—"', '\uD83D\uDDD3'],
    ['ðŸ"¸', '\uD83D\uDCF8'], ['ðŸ'¥', '\uD83D\uDC65'], ['ðŸ'¤', '\uD83D\uDC64'],
    ['ðŸ¥˜', '\uD83E\uDD58'], ['ðŸ²', '\uD83C\uDF72'], ['ðŸ·', '\uD83C\uDF77'],
    ['ðŸ'°', '\uD83D\uDCB0'], ['ðŸ'³', '\uD83D\uDCB3'],
    ['ðŸŒ¶ï¸', '\uD83C\uDF36\uFE0F'], ['ðŸŒ¶', '\uD83C\uDF36'],
    ['â­', '\u2B50'], ['ðŸ¥—', '\uD83E\uDD57'], ['ðŸ¥©', '\uD83E\uDD69'],
    ['âœ…', '\u2705'], ['â ï¸', '\u26A0\uFE0F'],
    ['ðŸ¡', '\uD83C\uDFE1'], ['ðŸ"', '\uD83D\uDCCC'],
    ['â°', '\u23F0'],
    ['ðŸ›µ', '\uD83D\uDEF5'], ['ðŸ¥¡', '\uD83E\uDD61'],
    ['ðŸ½ï¸', '\uD83C\uDF7D\uFE0F'], ['ðŸ½', '\uD83C\uDF7D'],
    ['ï¿½', ''],
];

for (const [from, to] of fixList) {
    content = content.split(from).join(to);
}

let after = (content.match(/Ã|Â[\xA0-\xFF]|ðŸ|â€|ï¿½/g) || []).length;
console.log('Fixed: ' + before + ' -> ' + after + ' garbled occurrences');

writeFileSync('src/App.tsx', content, 'utf8');
console.log('App.tsx fixed and saved.');
