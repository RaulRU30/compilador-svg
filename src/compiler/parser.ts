import { Token, ASTNode } from '../types';

/**
 * Función parser: Convierte una secuencia de tokens en un árbol de sintaxis abstracta (AST).
 * @param {Token[]} tokens - Un array de objetos que representan los tokens del código fuente.
 * @returns {ASTNode} - Un objeto que representa el AST generado.
 */
function parser(tokens: Token[]): ASTNode {
    /**
     * Función expectedTypeCheck: Verifica si el tipo actual coincide con el tipo esperado.
     * @param {string} type - Tipo actual del token.
     * @param {string|string[]} expect - Tipo esperado o un array de tipos esperados.
     * @returns {boolean} - true si hay coincidencia, false de lo contrario.
     */
    function expectedTypeCheck(type: string, expect: string | string[]): boolean {
        if (Array.isArray(expect)) {
            const i = expect.indexOf(type);
            return i >= 0;
        }
        return type === expect;
    }

    /**
     * Función createDot: Crea un nodo "dot" a partir de tokens.
     * @param {Token} current_token - Token actual.
     * @param {number} currentPosition - Posición actual en la secuencia de tokens.
     * @param {ASTNode} node - Nodo actual que se está construyendo.
     * @returns {ASTNode} - Nodo "dot" creado.
     */
    function createDot(current_token: Token, currentPosition: number = 0, node?: ASTNode): ASTNode {
        const expectedType = ['ob', 'number', 'number', 'cb'];
        const expectedLength = 4;
        
        if (!node) {
            node = { type: 'dot' };
        }

        if (currentPosition < expectedLength - 1) {
            if (expectedTypeCheck(current_token.type, expectedType[currentPosition])) {
                if (currentPosition === 1) {
                    node.x = current_token.value;
                }
                if (currentPosition === 2) {
                    node.y = current_token.value;
                }
                currentPosition++;
                const nextToken = tokens.shift();
                if (nextToken) {
                    createDot(nextToken, currentPosition, node);
                }
            } else {
                throw new Error(
                    `Esperando ${expectedType[currentPosition]} pero se encontró ${current_token.type}.`
                );
            }
        }
        return node;
    }

    /**
     * Función findArguments: Busca y valida los argumentos esperados para un comando.
     * @param {string} command - Nombre del comando.
     * @param {number} expectedLength - Longitud esperada de los argumentos.
     * @param {Array} expectedType - Tipos esperados para cada argumento.
     * @param {number} currentPosition - Posición actual en la secuencia de tokens.
     * @param {Array} currentList - Lista actual de argumentos que se están construyendo.
     * @returns {ASTNode[]} - Lista de argumentos validada.
     */
    function findArguments(
        command: string,
        expectedLength: number,
        expectedType?: Array<string | string[]>,
        currentPosition: number = 0,
        currentList: ASTNode[] = []
    ): ASTNode[] {
        while (expectedLength > currentPosition) {
            const token = tokens.shift();
            if (!token) {
                throw new Error(`${command} toma ${expectedLength} argumento(s).`);
            }

            if (expectedType) {
                const expected = expectedTypeCheck(token.type, expectedType[currentPosition]);
                if (!expected) {
                    throw new Error(
                        `${command} toma ${JSON.stringify(expectedType[currentPosition])} como argumento ${currentPosition + 1}. ${
                            token ? `Pero se encontró a ${token.type} ${token.value || ''}.` : ''
                        }`
                    );
                }
                if (token.type === 'number' && token.value) {
                    const numValue = Number(token.value);
                    if (numValue < 0 || numValue > 100) {
                        throw new Error(
                            `Valor encontrado ${token.value} por ${command}. El valor debe estar entre 0 - 100.`
                        );
                    }
                }
            }

            let arg: ASTNode = {
                type: token.type,
                value: token.value
            };
            
            if (token.type === 'ob') {
                arg = createDot(token);
            }
            
            currentList.push(arg);
            currentPosition++;
        }
        return currentList;
    }

    // Inicialización del AST
    const AST: ASTNode = {
        type: 'Drawing',
        body: []
    };
    let paper = false;
    let pen = false;

    // Procesa los tokens y construye el AST
    while (tokens.length > 0) {
        const current_token = tokens.shift();
        if (!current_token) break;

        if (current_token.type === 'word') {
            switch (current_token.value) {
                case '{':
                    AST.body!.push({
                        type: 'Block Start'
                    });
                    break;
                    
                case '}':
                    AST.body!.push({
                        type: 'Block End'
                    });
                    break;
                    
                case '//': {
                    const expression: ASTNode = {
                        type: 'CommentExpression',
                        value: ''
                    };
                    let next = tokens.shift();
                    while (next && next.type !== 'newline') {
                        expression.value += (next.value || '') + ' ';
                        next = tokens.shift();
                    }
                    AST.body!.push(expression);
                    break;
                }
                    
                case 'Papel':
                    if (paper) {
                        throw new Error('No puedes definir Papel más de una vez');
                    }
                    const papelExpression: ASTNode = {
                        type: 'CallExpression',
                        name: 'Papel',
                        params: []
                    };
                    const papelArgs = findArguments('Papel', 1);
                    papelExpression.params = papelExpression.params!.concat(papelArgs);
                    AST.body!.push(papelExpression);
                    paper = true;
                    break;
                    
                case 'Lapiz': {
                    const lapizExpression: ASTNode = {
                        type: 'CallExpression',
                        name: 'Lapiz',
                        params: []
                    };
                    const lapizArgs = findArguments('Lapiz', 1);
                    lapizExpression.params = lapizExpression.params!.concat(lapizArgs);
                    AST.body!.push(lapizExpression);
                    pen = true;
                    break;
                }
                    
                case 'Linea':
                    if (!paper) {
                        // TODO: No hay mensaje de error 'Debes crear Papel primero'
                    }
                    if (!pen) {
                        // TODO: No hay mensaje de error 'Debes definir Lapiz primero'
                    }
                    const lineaExpression: ASTNode = {
                        type: 'CallExpression',
                        name: 'Linea',
                        params: []
                    };
                    const lineaArgs = findArguments('Linea', 4);
                    lineaExpression.params = lineaExpression.params!.concat(lineaArgs);
                    AST.body!.push(lineaExpression);
                    break;
                    
                case 'Set': {
                    const args = findArguments('Set', 2, [['word', 'ob'], 'number']);
                    let obj: ASTNode;
                    
                    if (args[0].type === 'dot') {
                        AST.body!.push({
                            type: 'CallExpression',
                            name: 'Lapiz',
                            params: [args[1]]
                        });
                        obj = {
                            type: 'CallExpression',
                            name: 'Linea',
                            params: [
                                { type: 'number', value: args[0].x },
                                { type: 'number', value: args[0].y },
                                { type: 'number', value: args[0].x },
                                { type: 'number', value: args[0].y }
                            ]
                        };
                    } else {
                        obj = {
                            type: 'VariableDeclaration',
                            name: 'Set',
                            identifier: args[0],
                            value: args[1]
                        };
                    }

                    AST.body!.push(obj);
                    break;
                }
                    
                default:
                    throw new Error(`${current_token.value} no es un comando válido`);
            }
        } else if (['newline', 'ocb', 'ccb'].indexOf(current_token.type) < 0) {
            throw new Error(`Token inesperado de tipo: ${current_token.type}`);
        }
    }

    return AST;
}

export default parser;