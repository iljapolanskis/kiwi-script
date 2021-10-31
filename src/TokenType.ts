export default class TokenType {
    name: string;
    regex: string;

    constructor(name: string, regex: string) {
        this.name = name;
        this.regex = regex;
    }
}

export const tokenTypesList = {
    'NUMBER': new TokenType('NUMBER', '[0-9]*'),
    'VARIABLE': new TokenType('VARIABLE', '[а-я]*'),
    'SEMICOLON': new TokenType('SEMICOLON', ';'),
    'SPACE': new TokenType('SPACE', '[ \\n\\r\\t]*'),
    'ASSIGN': new TokenType('ASSIGN', 'РАВНО'),
    'LOG': new TokenType('LOG', 'КОНСОЛЬ'),
    'ADDITION': new TokenType('ADDITION', 'ПЛЮС'),
    'SUBTRACTION': new TokenType('SUBTRACTION', 'МИНУС'),
    'OPEN_PARENTHESIS': new TokenType('OPEN_PARENTHESIS', '\\('),
    'CLOSE_PARENTHESIS': new TokenType('CLOSE_PARENTHESIS', '\\)')
}
