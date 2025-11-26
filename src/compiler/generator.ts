// generator.ts
import { SVGElement } from '../types';

/**
 * Función generator: Convierte una representación estructurada de SVG en una cadena SVG.
 * @param {SVGElement} ast - Representación estructurada de SVG.
 * @returns {string} - Cadena SVG resultante.
 */
function generator(ast: SVGElement): string {
    /**
     * Función traverseSvgAst: Recorre la representación estructurada de SVG y genera una cadena SVG.
     * @param {SVGElement|SVGElement[]} obj - Nodo o array de nodos de la representación estructurada de SVG.
     * @param {string[]} parent - Pila de elementos padre para mantener la estructura jerárquica.
     * @param {SVGElement[][]} rest - Pila de nodos restantes para procesar.
     * @param {string} text - Cadena SVG resultante.
     * @returns {string} - Cadena SVG resultante.
     */
    function traverseSvgAst(
        obj: SVGElement | SVGElement[],
        parent: string[] = [],
        rest: SVGElement[][] = [],
        text: string = ''
    ): string {
        // Convierte el nodo en un array si no lo es
        let nodes: SVGElement[];
        if (!Array.isArray(obj)) {
            nodes = [obj];
        } else {
            nodes = obj;
        }

        while (nodes.length > 0) {
            const currentNode = nodes.shift();
            if (!currentNode) continue;

            const body = currentNode.body || '';
            const attr = Object.keys(currentNode.attr)
                .map((key) => `${key}="${currentNode.attr[key]}"`)
                .join(' ');

            const indent = parent.map(() => '\t').join('');
            text += `${indent}<${currentNode.tag} ${attr}>`;

            if (
                currentNode.body &&
                Array.isArray(currentNode.body) &&
                currentNode.body.length > 0
            ) {
                text += '\n';
                parent.push(currentNode.tag);
                rest.push(nodes);
                return traverseSvgAst(currentNode.body, parent, rest, text);
            }

            text += `${body}</${currentNode.tag}>\n`;
        }

        while (rest.length > 0) {
            const next = rest.pop();
            const tag = parent.pop();
            
            if (!tag) continue;
            
            const indent = parent.map(() => '\t').join('');
            text += `${indent}</${tag}>\n`;
            
            if (next && next.length > 0) {
                text = traverseSvgAst(next, parent, rest, text);
            }
        }

        return text;
    }

    return traverseSvgAst(ast);
}

export default generator;