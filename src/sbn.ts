import lexer from './compiler/lexer';
import parser from './compiler/parser';
import transformer from './compiler/transformer';
import generator from './compiler/generator';
import type { SBNCompiler } from './types';

const SBN: SBNCompiler = {
    lexer,
    parser,
    transformer,
    generator,
    
    compile(code: string): string {
        return this.generator(this.transformer(this.parser(this.lexer(code))));
    }
};

export default SBN;