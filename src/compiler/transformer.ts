import { ASTNode, SVGElement, VariableMap } from '../types';

/**
 * Función transformer: Convierte un AST en una representación estructurada de SVG.
 * @param {ASTNode} ast - Árbol de sintaxis abstracta (AST) generado a partir del código fuente.
 * @returns {SVGElement} - Representación estructurada de SVG.
 */
function transformer(ast: ASTNode): SVGElement {
    const variables: VariableMap = {};
    let current_pen_color: string | number | undefined;

    /**
     * Función makeColor: Genera una cadena de color RGB a partir de un nivel dado.
     * @param {number} level - Nivel de color (0-100).
     * @returns {string} - Cadena de color en formato RGB.
     */
    function makeColor(level?: string | number): string {
        let numLevel: number;
        
        if (typeof level === 'undefined') {
            numLevel = 100;
        } else {
            numLevel = typeof level === 'string' ? parseInt(level, 10) : level;
        }
        
        numLevel = 100 - numLevel; // invertir
        return `rgb(${numLevel}%, ${numLevel}%, ${numLevel}%)`;
    }

    /**
     * Función findParamValue: Busca el valor de un parámetro en función de su tipo.
     * @param {ASTNode} p - Parámetro.
     * @returns {number|string} - Valor del parámetro.
     */
    function findParamValue(p: ASTNode): string | number {
        if (p.type === 'word' && p.value && typeof p.value === 'string') {
            return variables[p.value];
        }
        return p.value as string | number;
    }

    // Definición de elementos SVG correspondientes a comandos específicos
    const elements: {
        [key: string]: (param: ASTNode[], pen_color_value?: string | number) => SVGElement;
    } = {
        'Linea': function (param: ASTNode[], pen_color_value?: string | number): SVGElement {
            return {
                tag: 'line',
                attr: {
                    x1: findParamValue(param[0]),
                    y1: 100 - Number(findParamValue(param[1])),
                    x2: findParamValue(param[2]),
                    y2: 100 - Number(findParamValue(param[3])),
                    stroke: makeColor(pen_color_value),
                    'stroke-linecap': 'round'
                },
                body: []
            };
        },
        'Papel': function (param: ASTNode[]): SVGElement {
            return {
                tag: 'rect',
                attr: {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100,
                    fill: makeColor(findParamValue(param[0]))
                },
                body: []
            };
        }
    };

    // Estructura base del nuevo AST en formato SVG
    const newAST: SVGElement = {
        tag: 'svg',
        attr: {
            width: 100,
            height: 100,
            viewBox: '0 0 100 100',
            xmlns: 'http://www.w3.org/2000/svg',
            version: '1.1'
        },
        body: []
    };

    // Procesa los nodos del AST y construye el nuevo AST en formato SVG
    while (ast.body && ast.body.length > 0) {
        const node = ast.body.shift();
        if (!node) continue;

        if (node.type === 'CallExpression' || node.type === 'VariableDeclaration') {
            if (node.name === 'Lapiz') {
                if (node.params && node.params[0]) {
                    current_pen_color = findParamValue(node.params[0] as ASTNode);
                }
            } else if (node.name === 'Set') {
                if (node.identifier && node.value) {
                    const identifierNode = node.identifier as ASTNode;
                    const valueNode = node.value as ASTNode;
                    if (identifierNode.value && typeof identifierNode.value === 'string') {
                        variables[identifierNode.value] = valueNode.value as string | number;
                    }
                }
            } else if (node.name) {
                const el = elements[node.name];
                if (!el) {
                    throw new Error(`${node.name} no es un comando válido.`);
                }
                if (typeof current_pen_color === 'undefined') {
                    // TODO: mensaje 'Debes definir Lapiz antes de dibujar Linea'
                }
                if (node.params) {
                    newAST.body.push(el(node.params as ASTNode[], current_pen_color));
                }
            }
        }
    }

    return newAST;
}

export default transformer;