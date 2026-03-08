const fs = require('fs');
const buf = fs.readFileSync('src/App.tsx');
const s = buf.toString('utf8');
const logoLine = s.split('\n').find(l => l.includes('logo:'));
if (logoLine) {
    console.log('Logo line raw:');
    for (let i = 0; i < logoLine.length; i++) {
        console.log(logoLine[i] + ' : ' + logoLine.charCodeAt(i).toString(16));
    }
}
