const fs = require('fs');

const fixList = [
    // Remaining Garbled Punctuation
    ['\u201D\u00A2', '\u2022'], // ”¢ -> •
    ['\u201D\u201D', '\u2014'], // ”” -> —
    ['\u201D', '"'],            // ” -> "

    // Branding Unification
    ['Churrasqueira Amores', "Chave D'Ouro Café"],
    ['CHURRASQUEIRA AMORES', "CHAVE D'OURO CAFÉ"],
    ['CHAVE D\u00B4DOURO CAF\u00C9', "CHAVE D'OURO CAFÉ"], // Fixed typo D´DOURO
    ['CHAVE D\u00B4OURO CAF\u00C9', "CHAVE D'OURO CAFÉ"],
    ['&nbsp;', ' '], // Remove HTML entity

    // Portuguese corrections if any missed
    ['Ã³', 'ó'], ['Ã©', 'é'], ['Ã¡', 'á'], ['Ã£', 'ã'], ['Ã§', 'ç'],
];

function fixFile(path) {
    let content = fs.readFileSync(path, 'utf8');
    let count = 0;
    fixList.forEach(([from, to]) => {
        let parts = content.split(from);
        if (parts.length > 1) {
            count += (parts.length - 1);
            content = parts.join(to);
        }
    });
    if (count > 0) {
        fs.writeFileSync(path, content, 'utf8');
        console.log(`Fixed ${count} characters/strings in ${path}`);
    } else {
        console.log(`No remaining fixes needed for ${path}`);
    }
}

fixFile('src/App.tsx');
fixFile('src/Admin.tsx');
console.log('Branding and encoding cleanup complete.');
