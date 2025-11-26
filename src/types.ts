/**
 * Tipos de tokens que puede reconocer el analizador lexico
 */
export type TokenType = 'newline' | 'ob' | 'cb' | 'ocb' | 'ccb' | 'word' | 'number';

/**
 * Representa un token individual del código fuente
 */
export interface Token {
    type: TokenType;
    value?: string;
}

/**
 * Representa un nodo del arbol de analisis sintactico
 */
export interface ASTNode {
    type: string;
    name?: string;
    params?: Array<string | number | ASTNode>;
    value?: string | number | ASTNode;
    body?: ASTNode[];
    identifier?: string | number | ASTNode;
    x?: string | number;
    y?: string | number;
    [key: string]: any;
}


/**
 * Representa un elemento SVG en el AST transformado
 */
export interface SVGElement {
    tag: string;
    attr: {
        [key: string]: string | number;
    };
    body: SVGElement[];
}

/**
 * Mapa de variables definidas en el código
 */
export interface VariableMap {
    [key: string]: string | number;
}


/**
 * Interfaz para el compilador SBN
 */
export interface SBNCompiler {
    lexer: (code: string) => Token[];
    parser: (tokens: Token[]) => ASTNode;
    transformer: (ast: ASTNode) => SVGElement;
    generator: (ast: SVGElement) => string;
    compile: (code: string) => string;
}