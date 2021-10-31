import Token from "./Token";
import { tokenTypesList } from "./TokenType";

export default class Lexer {

    // Define constants
    readonly ASSERT_POSITION_AT_LINE_BEGINING = '^';

    code: string;
    position: number = 0;
    tokenList: Token[] = [];

    constructor(code: string) {
        this.code = code;
    }

    lexAnalysis(): Token[] {
        // TODO: Не очень ясно, что происходит
        // процедурная функция используется как
        // функция проверки на продолжение работы
        while (this.nextToken()) {}

        this.tokenList = this.tokenList.filter( token => token.type !== tokenTypesList.SPACE );

        return this.tokenList;
    }

    nextToken(): boolean {
        if (this.position >= this.code.length) {
            return false;
        }

        const tokenTypesValues = Object.values(tokenTypesList);

        for (let i = 0; i < tokenTypesValues.length; i++) {
            const tokenType = tokenTypesValues[i];
            const regex = new RegExp(this.ASSERT_POSITION_AT_LINE_BEGINING + tokenType.regex);
            const result = this.code.substr(this.position).match(regex);

            if (result && result[0]) {
                const token = new Token(tokenType, result[0], this.position);
                this.position += result[0].length;
                this.tokenList.push(token);
                return true;
            }
        }

        throw new Error(`На позиции ${ this.position } обнаружена ошибка`);

    }
}