import { Token } from '../types';

/**
 * Función lexer: Analiza el código fuente y lo convierte en una serie de tokens.
 * @param {string} code - El código fuente que se analizará.
 * @returns {Token[]} - Un array de objetos que representan los tokens.
 */
function lexer(code: string): Token[] {
    // Reemplaza caracteres especiales y realiza un split basado en espacios y otros caracteres de espacio.
    const _tokens: string[] = code
        .replace(/[\n\r]/g, ' *nl* ')
        .replace(/\[/g, ' *ob* ')
        .replace(/\]/g, ' *cb* ')
        .replace(/\{/g, ' *ocb* ')
        .replace(/\}/g, ' *ccb* ')
        .split(/[\t\f\v ]+/);

    // Array que almacenará los tokens finales.
    const tokens: Token[] = [];

    // Itera a través de los tokens generados y clasifica cada uno.
    for (let i = 0; i < _tokens.length; i++) {
        const t = _tokens[i];

        if (t.length <= 0 || isNaN(Number(t))) {
            // Si es un carácter especial, como un salto de línea o corchetes, agrega el token correspondiente.
            if (t === '*nl*') {
                tokens.push({ type: 'newline' });
            } else if (t === '*ob*') {
                tokens.push({ type: 'ob' });
            } else if (t === '*cb*') {
                tokens.push({ type: 'cb' });
            } else if (t === '*ocb*') {
                tokens.push({ type: 'ocb' });
            } else if (t === '*ccb*') {
                tokens.push({ type: 'ccb' });
            } else if (t.length > 0) {
                // Si no es un carácter especial y tiene longitud mayor a cero, es considerado una palabra.
                tokens.push({ type: 'word', value: t });
            }
        } else {
            // Si no es un carácter especial y no es NaN, se considera un número.
            tokens.push({ type: 'number', value: t });
        }
    }

    // Si no se encuentran tokens, se lanza una excepción.
    if (tokens.length < 1) {
        throw new Error('No se encontraron tokens. Prueba con "Papel 10"');
    }

    return tokens;
}

export default lexer;