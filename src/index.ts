import Lexer from "./Lexer";
import Parser from "./Parser";

// Задаём код на примитивном языке программирования KiwiScript
const code =
    `сумма РАВНО (5 ПЛЮС 3) МИНУС (4) ПЛЮС 2;
    КОНСОЛЬ сумма;`

// Прогоняем код через лексер
const lexer = new Lexer(code);
lexer.lexAnalysis();

//Прогоняем чечез парсер, получем абстрактное синтаксическое дерево
// И запускаем код
const parser = new Parser(lexer.tokenList);
const rootNode = parser.parseCode();
parser.execute(rootNode);
