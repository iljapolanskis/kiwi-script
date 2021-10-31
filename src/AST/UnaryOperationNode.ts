import ExpressionNode from "./ExpressionNode";
import Token from "../Token";

export default class UnaryOperationNode extends ExpressionNode {

    operator: Token;
    operand: ExpressionNode;


    constructor(operator: Token, operand: ExpressionNode) {
        super();
        this.operator = operator;
        this.operand = operand;
    }
}