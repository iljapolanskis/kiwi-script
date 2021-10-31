import TokenType from "./TokenType";

export default class Token {
    type: TokenType;
    text: string;
    position: number;

    constructor(type: TokenType, text: string, position: number) {
        this.type = type;
        this.text = text;
        this.position = position;
    }

}