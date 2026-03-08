const fs = require('fs');
const s = fs.readFileSync('src/App.tsx', 'utf8');
const lines = s.split('\n');
[70, 79, 88].forEach(idx => {
    const l = lines[idx];
    if (l) {
        console.log('Line ' + (idx + 1) + ': ' + l.trim());
        for (let i = 0; i < l.length; i++) {
            const c = l.charCodeAt(i);
            if (c > 127) {
                console.log('  ' + l[i] + ' : \\u' + c.toString(16).padStart(4, '0'));
            }
        }
    }
});
