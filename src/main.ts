import * as fs from 'fs';
import sbn from './sbn';

const defaultCode = `Papel 0
Lapiz 100
Linea 10 90 90 90
Linea 90 10 90 90
Linea 10 10 90 10
Linea 10 10 10 90`;

const inputArg = process.argv[2];

let code: string;

if (inputArg) {
    try {
        code = fs.readFileSync(inputArg, 'utf8');
        console.log(`Compilando archivo: ${inputArg}\n`);
    } catch (err) {
        console.error(`No pude leer el archivo "${inputArg}", usando código por defecto.\nError:`, err);
        code = defaultCode;
    }
} else {
    console.log('No se recibió archivo, usando código por defecto.\n');
    code = defaultCode;
}


console.log('Analizador Lexico:');
console.log(sbn.lexer(code));
console.log('\n\n\nParser:');
console.log(sbn.parser(sbn.lexer(code)));
console.log('\n\n\nTransformador:');
console.log(sbn.transformer(sbn.parser(sbn.lexer(code))));
console.log('\n\n\nGenerador:');
console.log(sbn.generator(sbn.transformer(sbn.parser(sbn.lexer(code)))));

fs.writeFile('dibujo.svg', sbn.compile(code), (err) => {
    if (err) {
        console.error('Error al escribir el archivo:', err);
        return;
    }
    console.log('SVG generado y guardado en dibujo.svg');
});