const fs = require('fs');

function fixQuoting(path) {
    let content = fs.readFileSync(path, 'utf8');

    // Find strings like '...Chave D'Ouro Café...' and change outer quotes to double quotes
    // We use a regex that looks for single-quoted strings containing the target
    // The trick is handling the inner single quote correctly.

    // Literal replacement for known problematic strings found in lint:
    const replacements = [
        ["'Chave D'Ouro Café'", '"Chave D\'Ouro Café"'],
        ["'CHAVE D'OURO CAFÉ'", '"CHAVE D\'OURO CAFÉ"'],
        ["'Na Chave D'Ouro Café", '"Na Chave D\'Ouro Café'],
        [" Café',", ' Café",'],
        [" Café' }", ' Café" }'],
        [" Café')", ' Café")'],
        ["'Chave D'", '"Chave D\'"'], // Partial if needed
    ];

    let count = 0;
    replacements.forEach(([from, to]) => {
        let parts = content.split(from);
        if (parts.length > 1) {
            count += (parts.length - 1);
            content = parts.join(to);
        }
    });

    // More aggressive regex for any '...D'Ouro...' 
    // This looks for ' followed by anything not ', then D'Ouro, then anything not ', then '
    // We replace the outer ' with "
    const regex = /'([^'\n]*D'Ouro[^'\n]*)'/g;
    content = content.replace(regex, (match, inner) => {
        count++;
        return `"${inner}"`;
    });

    if (count > 0) {
        fs.writeFileSync(path, content, 'utf8');
        console.log(`Fixed ${count} quoting issues in ${path}`);
    } else {
        console.log(`No quoting issues found in ${path}`);
    }
}

fixQuoting('src/App.tsx');
fixQuoting('src/Admin.tsx');
console.log('Quoting fix complete.');
