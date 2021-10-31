import NumberNode from "./AST/NumberNode";
import StatementsNode from "./AST/StatementsNode";
import VariableNode from "./AST/VariableNode";
import Token from "./Token"
import TokenType, {tokenTypesList} from "./TokenType";
import BinaryOperationNode from "./AST/BinaryOperationNode";
import ExpressionNode from "./AST/ExpressionNode";
import UnaryOperationNode from "./AST/UnaryOperationNode";

export default class Parser {
    tokens: Token[];
    position: number = 0;
    scope: any = {}


    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    match(...expected: TokenType[]): Token | null {
        if (this.position < this.tokens.length) {
            const currentToken = this.tokens[this.position];
            if (expected.find(tokenType => tokenType === currentToken.type)) {
                this.position += 1;
                return currentToken;
            }
        }
        return null;
    }

    require(...expected: TokenType[]): Token {
        const foundToken = this.match(...expected);

        if (foundToken === null) {
            const expectedTokenTypes = expected.map( tokenType => { return tokenType.name })
            throw new Error(`На позиции ${ this.position } ожидается ${expectedTokenTypes}`);
        }

        return foundToken;
    }

    parseCode(): ExpressionNode {
        const root = new StatementsNode();

        while (this.position < this.tokens.length) {
            const codeStringNode = this.parseExpression();
            this.require(tokenTypesList.SEMICOLON);
            root.addNode(codeStringNode);
        }
        return root;
    }

    parseExpression() {
        if (this.match(tokenTypesList.VARIABLE) === null) {
            // Если не переменная, то ожидаем оператор/функцию
            // TODO: Добавить switch case
            return this.parsePrint();
        }
        // Произошло смещение указателя в функции match()
        // Возвращаем его в исходное состояние
        this.position -= 1;

        const variableNode = this.parseVariableOrNumber();

        const assignOperator = this.match(tokenTypesList.ASSIGN);
        if (assignOperator !== null) {
            const rightFormulaNode = this.parseFormula();
            return new BinaryOperationNode(assignOperator, variableNode, rightFormulaNode);
        }
        throw new Error(`После переменной ожидается оператор ${tokenTypesList.ASSIGN.name} на позиции ${this.position}`);
    }

    parseVariableOrNumber(): VariableNode | NumberNode {
        const number = this.match(tokenTypesList.NUMBER);
        if (number !== null) {
            return new NumberNode(number);
        }

        const variable = this.match(tokenTypesList.VARIABLE);
        if (variable !== null) {
            return  new VariableNode(variable);
        }

        throw new Error(`На позиции ${this.position} ожидается 
                        ${tokenTypesList.NUMBER.name} или ${tokenTypesList.VARIABLE.name}`);
    }

    parseFormula(): ExpressionNode {
        let leftNode = this.parseParenthesis();
        let operator = this.match(tokenTypesList.ADDITION, tokenTypesList.SUBSTRACTION);
        while (operator !== null) {
            const rightNode = this.parseParenthesis();
            leftNode = new BinaryOperationNode(operator, leftNode, rightNode);
            operator = this.match(tokenTypesList.ADDITION, tokenTypesList.SUBSTRACTION);
        }
        return leftNode;
    }

    parseParenthesis(): ExpressionNode {
        if (this.match(tokenTypesList.OPEN_PARENTHESIS) !== null) {
            const node = this.parseFormula();
            this.require(tokenTypesList.CLOSE_PARENTHESIS);
            return node;
        } else {
            return this.parseVariableOrNumber();
        }
    }

    parsePrint(): ExpressionNode {
        const operatorLog = this.match(tokenTypesList.LOG);
        if (operatorLog !== null) {
            return new UnaryOperationNode(operatorLog, this.parseFormula());
        }
        throw new Error(`Ожидается оператор ${tokenTypesList.LOG.name} на позиции ${this.position}`);
    }

    execute(node: ExpressionNode): any {
        // TODO: Ввести switch здесь

        if (node instanceof NumberNode) {
            return parseInt(node.number.text);
        }

        if (node instanceof UnaryOperationNode) {
            switch (node.operator.type) {
                case tokenTypesList.LOG:
                    console.log(this.execute(node.operand));
                    return;
            }
        }

        if (node instanceof BinaryOperationNode) {
            switch (node.operator.type) {
                case tokenTypesList.ADDITION:
                    return this.execute(node.leftNode) + this.execute(node.rightNode);
                case tokenTypesList.SUBSTRACTION:
                    return this.execute(node.leftNode) - this.execute(node.rightNode);
                case tokenTypesList.ASSIGN:
                    const result = this.execute(node.rightNode);
                    const variableNode = <VariableNode>node.leftNode;
                    this.scope[variableNode.variable.text] = result;
                    return result;
            }
        }
        if (node instanceof VariableNode) {
            if (this.scope[node.variable.text]) {
                return this.scope[node.variable.text];
            }
            throw new Error(`Не существует переменной с именемем ${node.variable.text}`);
        }

        if (node instanceof StatementsNode) {
            node.codeStrings.forEach(lineOfCode => this.execute(lineOfCode));
            return 0;
        }
        throw new Error(`Ошибка компиляции!`);
    }

}