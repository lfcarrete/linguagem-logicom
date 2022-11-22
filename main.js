const { table } = require("console");
var prompt = require('syncprompt');

const Alfabeto = {
    PLUS: "+",
    MINUS: "-",
    MULTI: "*",
    DIV: "/",
    EQUAL: "=",
    PARLEFT: "(",
    PARRIGHT: ")",
    KEYLEFT: "{",
    KEYRIGHT: "}",
    AND: "&&",
    OR: "||",
    NOT: "!",
    EQUALEQUAL: "==",
    MAIOR: ">",
    MENOR: "<",
    INT: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    PRINT: "p",
    WHILE: "w",
    IF: "i",
    ELSE: "e",
    READ: "l",
    VAR: "v",
    ENDLINE: ";",
    CONCAT: ".",
    DOISPONTOS: ":",
    STRING: "s",
    I32: "n",
    VIRGULA: ",",
    ASPAS: "\"",
    RETURN: "r",
    ARROW: "->",
    FN: "f",
    IDENTIFIER: new RegExp("[A-Za-z][A-Za-z0-9_]*"),
    RESERVED_WORDS: ["p", "w", "i", "e", "l", "v", "s", "n", "r", "f"]
}

class SymbolTable {
    table = {};
    getter(key) {
        
        const tableVal = this.table[key];
        if (!tableVal && tableVal != 0) {
            throw "Variavel nao existe";
        }
        return this.table[key];
    }
    setter(key, value) {
        const tableVal = this.table[key];
        
        if (!tableVal && tableVal != 0) {
            throw "Variavel nao existe2";
        }
        if(value[1] != this.table[key][0] && this.table[key].length <= 1){
            throw "conflito de tipaggem"
        }
        if(value[1] != this.table[key][1] && this.table[key].length > 1){
            throw "conflito de tipaggem2"
        }
        var newitem = this.table[key].length <= 1 ? [value[0], this.table[key][0]] : [value[0], this.table[key][1]]
        this.table[key] = newitem
        
    }
    createVarType(key, type) {
        const tableVal = this.table[key];
        if (!tableVal && tableVal != 0) {
            this.table[key] = [type];
        } else {
            throw "var ja esta definida"
        }
    }
}

class FuncTable {
    table = {};
    static getter(key) {

        const tableVal = table[key];
    
        if (!tableVal && tableVal != 0) {
            throw "Variavel nao existe";
        }
        return table[key];
    }

    static createVarType(key, type, ref) {
        const tableVal = table[key[0]];
       
        if (!tableVal && tableVal != 0) {
            table[key[0]] = [type, ref];
        } else {
            throw "func ja esta definida"
        }
    }
}

class Node {
    constructor() {
        if (this.constructor == Node) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }
    value;
    children;
    Evaluate(st) {
        throw new Error(" Added abstract Method has no implementation");
    }
}

class BinOp extends Node {
    value;
    children;
    constructor(value, children) {
        super();
        this.value = value;
        this.children = children;
    }
    Evaluate(st) {
        var result = 0;
        var type = Alfabeto.I32;
        var eval0 = this.children[0].Evaluate(st)
        var eval1 = this.children[1].Evaluate(st)
        switch (this.value) {
            case Alfabeto.PLUS:
                if(eval0[1] != eval1[1]) throw "Erro de tipagem"
                result = eval0[0] + eval1[0];
                break;
            case Alfabeto.MINUS:
                if(eval0[1] != eval1[1]) throw "Erro de tipagem"
                result = eval0[0] - eval1[0];
                break;
            case Alfabeto.MULTI:
                if(eval0[1] != eval1[1]) throw "Erro de tipagem"
                result = eval0[0] * eval1[0];
                break;
            case Alfabeto.DIV:
                if(eval0[1] != eval1[1]) throw "Erro de tipagem"
                result = Math.floor(eval0[0] / eval1[0]);
                break;
            case Alfabeto.EQUALEQUAL:
                if(eval0[1] != eval1[1]) throw "Erro de tipagem"
                result = eval0[0] == eval1[0] ? 1 : 0;
                break;
            case Alfabeto.MAIOR:
                if(eval0[1] != eval1[1]) throw "Erro de tipagem"
                result = eval0[0] > eval1[0] ? 1 : 0;
                break;
            case Alfabeto.MENOR:
                if(eval0[1] != eval1[1]) throw "Erro de tipagem"
                result = eval0[0] < eval1[0] ? 1 : 0;;
                break;
            case Alfabeto.OR:
                if(eval0[1] != eval1[1]) throw "Erro de tipagem"
                result = eval0[0] || eval1[0] ? 1 : 0;;
                break;
            case Alfabeto.AND:
                if(eval0[1] != eval1[1]) throw "Erro de tipagem"
                result = eval0[0] && eval1[0] ? 1 : 0;;
                break;
            case Alfabeto.CONCAT:
                result = eval0[0].toString() + eval1[0].toString();
                var type = Alfabeto.STRING;
                break;
        }
        return [result, type];
    }
}
class UnOp extends Node {
    constructor(value, child1) {
        super();
        this.value = value;
        this.children = [child1];
    }
    Evaluate(st) {
        var result = 0;
        switch (this.value) {
            case Alfabeto.PLUS:
                result += this.children[0].Evaluate(st)[0];
                break;
            case Alfabeto.MINUS:
                result -= this.children[0].Evaluate(st)[0];
                break;
            case Alfabeto.NOT:

                result = !this.children[0].Evaluate(st)[0];
                break;
        }
        return [result, Alfabeto.I32];
    }
}
class IntOp extends Node {
    constructor(value) {
        super();
        this.value = value;
        this.children = [];
    }
    Evaluate(st) {
        return [this.value, Alfabeto.I32];
    }
}
class NoOp extends Node {
    constructor() {
        super();
        this.value = null;
        this.children = null;
    }
    Evaluate(st) {
        return null;
    }
}

class BlockNode extends Node {
    constructor(children) {
        super();
        this.value = null;
        this.children = children;
    }
    Evaluate(st) {
        for (let i = 0; i < this.children.length; i++) {
            if(this.children[i].value === "return"){
                return this.children[i].children[0][0].Evaluate(st);
            }
            this.children[i].Evaluate(st);
        }
    }
}

class PrintNode extends Node {
    constructor(child) {
        super();
        this.value = null;
        this.children = [child];
    }
    Evaluate(st) {
        console.log(this.children[0].Evaluate(st)[0]);
    }
}

class AssignmentsNode extends Node {
    constructor(value, children) {
        super();
        this.value = value;
        this.children = children;
    }
    Evaluate(st) {
        st.setter(this.children[0].value, this.children[1].Evaluate(st));   
    }
}

class IdentifierNode extends Node {
    constructor(value) {
        super();
        this.value = value;
        this.children = null;
    }
    Evaluate(st) {
        return st.getter(this.value);
    }
}
class IfNode extends Node {
    constructor(children) {
        super();
        this.value = null;
        this.children = children;
    }
    Evaluate(st) {

        if (this.children[0].Evaluate(st) == 1) {
            this.children[1].Evaluate(st)
        } else if (this.children.length > 2) {
            this.children[2].Evaluate(st)
        }

    }
}

class WhileNode extends Node {
    constructor(children) {
        super();
        this.value = null;
        this.children = children;
    }
    Evaluate(st) {
        while (this.children[0].Evaluate(st)[0] == 1) {
            this.children[1].Evaluate(st)
        }
    }
}
class ReadNode extends Node {
    constructor() {
        super();
        this.value = null;
        this.children = null;
    }
    Evaluate(st) {
        var userInput = prompt('');
        return [parseInt(userInput), Alfabeto.I32];
    }
}

class VarDec extends Node {
    constructor(type, chidren) {
        super();
        this.value = type;
        this.children = chidren;
    }
    Evaluate(st) {
        for(let i = 0; i < this.children.length; i++){
            st.createVarType(this.children[i], this.value);
        }
    }
}

class StrVal extends Node {
    constructor(valor) {
        super();
        this.value = valor;
        this.children = null;
    }
    Evaluate(st) {
        return [this.value, Alfabeto.STRING];
    }
}

class FuncDec extends Node {
    constructor(value, children) {
        super();
        this.value = value;
        this.children = children;
    }
    Evaluate() {
       
        FuncTable.createVarType(this.children, this.value, this);
        
        return null;
    }
}

class FuncCall extends Node {
    constructor(value, children) {
        super();
        this.value = value;
        this.children = children;
    }
    Evaluate(st) {

        const func = FuncTable.getter(this.value);
        let localSymbolTable = new SymbolTable();
        if(this.children.length == func[1].children.length-2){
            for(let i = 0; i < this.children.length; i++){
                func[1].children[i+1].Evaluate(localSymbolTable);
                
                    
                var val = this.children[i].Evaluate(st);
                

                localSymbolTable.setter(func[1].children[i+1].children[0], val);
                
            }

        } else throw "falta argumento";

        return func[1].children[func[1].children.length-1].Evaluate(localSymbolTable)
    }
}

class ReturnNode extends Node {
    constructor(child) {
        super();
        this.value = "return";
        this.children = [child];
    }
    Evaluate(st) {
        return this.children[0].Evaluate(st);
    }
}


class PrePro {
    static filter(src) {
        let newStirng = "";
        let addItems = true;
        for (let i = 0; i < src.length; i++) {
            if (src[i] === "/" && src[i + 1] === "/") {
                addItems = false;
            }
            if (addItems) {
                newStirng += src[i];
            } else if (!addItems && (src[i] == "\n" || src[i] == "\n")) {
                addItems = true;
            }
        }
        return newStirng;
    }
}

class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

class Tokenizer {
    constructor(source) {
        this.source = source;
        this.position = 0;
        this.next = null;
    }
    selectNext() {
        if (this.position >= this.source.length) {
            this.next = new Token("EOF", null);
        } else if (this.source[this.position] === Alfabeto.EQUAL && this.source[this.position + 1] === Alfabeto.EQUAL) {
            this.next = new Token("EQUALEQUAL", Alfabeto.EQUALEQUAL);
            this.position += 2;
        } else if (this.source[this.position] === "|" && this.source[this.position + 1] === "|") {
            this.next = new Token("OR", Alfabeto.OR);
            this.position += 2;
        } else if (this.source[this.position] === "-" && this.source[this.position + 1] === ">") {
            this.next = new Token("ARROW", Alfabeto.ARROW);
            this.position += 2;
        } else if (this.source[this.position] === Alfabeto.PLUS) {
            this.next = new Token("PLUS", this.source[this.position]);
            this.position += 1;
        } else if (this.source[this.position] === Alfabeto.MINUS) {
            this.next = new Token("MINUS", this.source[this.position]);
            this.position += 1;
        } else if (this.source[this.position] === Alfabeto.MULTI) {
            this.next = new Token("MULTI", this.source[this.position]);
            this.position += 1;
        } else if (this.source[this.position] === Alfabeto.DIV) {
            this.next = new Token("DIV", this.source[this.position]);
            this.position += 1;
        } else if (this.source[this.position] === Alfabeto.PARLEFT) {
            this.next = new Token("PARLEFT", this.source[this.position]);
            this.position += 1;
        } else if (this.source[this.position] === Alfabeto.PARRIGHT) {
            this.next = new Token("PARRIGHT", this.source[this.position]);
            this.position += 1;
        } else if (this.source[this.position] === Alfabeto.KEYRIGHT) {
            this.next = new Token("KEYRIGHT", this.source[this.position]);
            this.position += 1;
        } else if (this.source[this.position] === Alfabeto.KEYLEFT) {
            this.next = new Token("KEYLEFT", this.source[this.position]);
            this.position += 1;
        } else if (this.source[this.position] === Alfabeto.EQUAL) {
            this.position += 1;
            this.next = new Token("EQUAL", this.source[this.position]);
        } else if (this.source[this.position] === Alfabeto.ENDLINE) {
            this.next = new Token("ENDLINE", this.source[this.position]);
            this.position += 1;
        } else if (this.source[this.position] === Alfabeto.MAIOR) {
            this.next = new Token("MAIOR", this.source[this.position]);
            this.position += 1;
        } else if (this.source[this.position] === Alfabeto.CONCAT) {
            this.next = new Token("CONCAT", this.source[this.position]);
            this.position += 1;
        } else if (this.source[this.position] === Alfabeto.DOISPONTOS) {
            this.next = new Token("DOISPONTOS", this.source[this.position]);
            this.position += 1;
        } else if (this.source[this.position] === Alfabeto.VIRGULA) {
            this.next = new Token("VIRGULA", this.source[this.position]);
            this.position += 1;
        } else if (this.source[this.position] === Alfabeto.MENOR) {
            this.next = new Token("MENOR", this.source[this.position]);
            this.position += 1;
        } else if (this.source[this.position] === Alfabeto.NOT) {
            this.next = new Token("NOT", this.source[this.position]);
            this.position += 1;
        } else if (this.source[this.position] === "v" && this.source[this.position + 1] === "a" && this.source[this.position + 2] === "r") {
            this.next = new Token("VAR", Alfabeto.VAR);
            this.position += 3;
        } else if (this.source[this.position] === "i" && this.source[this.position + 1] === "3" && this.source[this.position + 2] === "2") {
            this.next = new Token("I32", Alfabeto.I32);
            this.position += 3;
        } else if (this.source[this.position] === "S" && this.source[this.position + 1] === "t" && this.source[this.position + 2] === "r" && this.source[this.position + 3] === "i" && this.source[this.position + 4] === "n" && this.source[this.position + 5] === "g") {
            this.next = new Token("STRING", Alfabeto.STRING);
            this.position += 6;
        } else if (this.source[this.position] === Alfabeto.ASPAS) {
            var str = "";
            this.position += 1;
            while (this.source[this.position] != Alfabeto.ASPAS && this.position < this.source.length) {
                str = str + this.source[this.position];
                this.position += 1;
            }
            this.next = new Token("STRINGVALUE", str);
            this.position += 1;
        } else if (this.source[this.position] === "&" && this.source[this.position + 1] === "&") {
            this.next = new Token("AND", Alfabeto.AND);
            this.position += 2;
        } else if (/^[a-zA-Z]+$/.test(this.source[this.position])) {
            var valor = this.source[this.position];
            this.position += 1;
            while (/[a-zA-Z]/.test(this.source[this.position]) || /\d/.test(this.source[this.position]) || this.source[this.position] === "_") {
                valor += this.source[this.position]
                this.position += 1;
            }
            if (Alfabeto.RESERVED_WORDS.includes(valor)) {
                if (valor === Alfabeto.PRINT) {
                    this.next = new Token("PRINT", Alfabeto.PRINT);
                } else if (valor === Alfabeto.WHILE) {
                    this.next = new Token("WHILE", Alfabeto.WHILE);
                } else if (valor === Alfabeto.IF) {
                    this.next = new Token("IF", Alfabeto.IF);
                } else if (valor === Alfabeto.ELSE) {
                    this.next = new Token("ELSE", Alfabeto.ELSE);
                } else if (valor === Alfabeto.STRING) {
                    this.next = new Token("STRING", Alfabeto.STRING);
                } else if (valor === Alfabeto.VAR) {
                    this.next = new Token("VAR", Alfabeto.VAR);
                } else if (valor === Alfabeto.I32) {
                    this.next = new Token("I32", Alfabeto.I32);
                } else if (valor === Alfabeto.RETURN) {
                    this.next = new Token("RETURN", Alfabeto.RETURN);
                } else if (valor === Alfabeto.FN) {
                    this.next = new Token("FN", Alfabeto.FN);
                } else {
                    this.next = new Token("READ", Alfabeto.READ);
                }
            } else {
                this.next = new Token("IDENTIFIER", valor);
            }

        } else if (this.source[this.position] === " " || this.source[this.position] === "\r" || this.source[this.position] === "\n") {
            this.position += 1;
            this.selectNext();
        } else if (Alfabeto.INT.includes(this.source[this.position])) {
            let tokenValue = "";
            while (Alfabeto.INT.includes(this.source[this.position]) && this.position < this.source.length) {
                tokenValue += this.source[this.position];
                this.position += 1;
            };

            this.next = new Token("INT", parseInt(tokenValue))
        } else {
            throw "Travou"
        }
        
    }
}

class Parser {
    static tokenizer = null;

    static declaration() {
        if (Parser.tokenizer.next.type === "FN") {
            Parser.tokenizer.selectNext();
            if (Parser.tokenizer.next.type === "IDENTIFIER") {
                const filhosDec = [Parser.tokenizer.next.value];
    
                Parser.tokenizer.selectNext();
                if (Parser.tokenizer.next.type === "PARLEFT") {
                    Parser.tokenizer.selectNext();
                    if(Parser.tokenizer.next.type === "IDENTIFIER"){
                        const varKey = [Parser.tokenizer.next.value];
                        Parser.tokenizer.selectNext();
                        while(Parser.tokenizer.next.type === "VIRGULA"){
                            Parser.tokenizer.selectNext();
                            varKey.push(Parser.tokenizer.next.value);
                            Parser.tokenizer.selectNext();

                        }
                        if(Parser.tokenizer.next.type === "DOISPONTOS"){
                            Parser.tokenizer.selectNext();
                            if(Parser.tokenizer.next.type === "I32" || Parser.tokenizer.next.type === "STRING"){
                                const varType = Parser.tokenizer.next.value;
                                const varDec = new VarDec(varType, varKey);
                                filhosDec.push(varDec);
                                Parser.tokenizer.selectNext();
                                
                                while(Parser.tokenizer.next.type === "VIRGULA"){
                                    Parser.tokenizer.selectNext();
                                    if(Parser.tokenizer.next.type === "IDENTIFIER"){
                                        const varKey = [Parser.tokenizer.next.value];
                                        Parser.tokenizer.selectNext();
                                        while(Parser.tokenizer.next.type === "VIRGULA"){
                                            Parser.tokenizer.selectNext();
                                            varKey.push(Parser.tokenizer.next.value);
                                            Parser.tokenizer.selectNext();
                
                                        }
                                        if(Parser.tokenizer.next.type === "DOISPONTOS"){
                                            Parser.tokenizer.selectNext();
                                            if(Parser.tokenizer.next.type === "I32" || Parser.tokenizer.next.type === "STRING"){
                                                const varType = Parser.tokenizer.next.value;
                                                const varDec = new VarDec(varType, varKey);
                                                filhosDec.push(varDec);
                                                Parser.tokenizer.selectNext();
                                            } else throw "Falta tipo";
                                        } else throw "FALTA DOIS PONTOS";
                                    }
                                }
                            } else throw "Falta tipo";
                        } else throw "FALTA DOIS PONTOS";
                    }
                    
                } else throw "falta (";
                if(Parser.tokenizer.next.type === "PARRIGHT") {
                    Parser.tokenizer.selectNext();
                    var funcType = null;
                    if(Parser.tokenizer.next.type === "ARROW"){
                        Parser.tokenizer.selectNext();
                        if(Parser.tokenizer.next.type === "I32" || Parser.tokenizer.next.type === "STRING"){
                            funcType = Parser.tokenizer.next.value;;
                            Parser.tokenizer.selectNext();
                        }
                    }
                    var block = Parser.parseBlock();
                    filhosDec.push(block);
                    
                    return new FuncDec(funcType, filhosDec);
                } throw "FALTA PARRIGHT";
            } else throw "falta nome de func";
        } else throw "Falta FN";
    }

    static program() {
        var funcDecs = [];
        while(Parser.tokenizer.next.type != "EOF"){
            var func = Parser.declaration();
        
            funcDecs.push(func);
        }
        funcDecs.push(new FuncCall("Main",[]));
        return new BlockNode(funcDecs);
    }

    static parseFactor() {
        
        var newNode = null;
        if (Parser.tokenizer.next.type === "IDENTIFIER") {
            const identName = Parser.tokenizer.next.value;
            Parser.tokenizer.selectNext();
            if(Parser.tokenizer.next.type === "PARLEFT"){
                Parser.tokenizer.selectNext();
                if(Parser.tokenizer.next.type === "PARRIGHT"){
                    Parser.tokenizer.selectNext();
                    return new FuncCall(identName, []);
                } else {
                    var arg = [Parser.relExpression()];
                    while(Parser.tokenizer.next.type === "VIRGULA"){
                        Parser.tokenizer.selectNext();
                        arg.push(Parser.relExpression());
                    }
                    if(Parser.tokenizer.next.type === "PARRIGHT"){
                        Parser.tokenizer.selectNext();
                        return new FuncCall(identName, arg);
                    } else throw "FALTAAA";

                }
            } else {
                newNode = new IdentifierNode(identName);
                return newNode;
            }
        }
        else if (Parser.tokenizer.next.type === "INT") {
            newNode = new IntOp;
            newNode.value = Parser.tokenizer.next.value;
            Parser.tokenizer.selectNext();
            return newNode;
        } else if (Parser.tokenizer.next.type === "STRINGVALUE") {
            newNode = new StrVal(Parser.tokenizer.next.value);
            Parser.tokenizer.selectNext();
            return newNode;
        } else if (Parser.tokenizer.next.type === "PLUS" || Parser.tokenizer.next.type === "MINUS" || Parser.tokenizer.next.type === "PARLEFT" || Parser.tokenizer.next.type === "NOT" || Parser.tokenizer.next.type === "READ") {
            if (Parser.tokenizer.next.type === "PLUS") {
                Parser.tokenizer.selectNext();
                newNode = new UnOp(Alfabeto.PLUS, Parser.parseFactor());
            } else if (Parser.tokenizer.next.type === "MINUS") {
                Parser.tokenizer.selectNext();
                newNode = new UnOp(Alfabeto.MINUS, Parser.parseFactor());
            } else if (Parser.tokenizer.next.type === "NOT") {
                Parser.tokenizer.selectNext();
                newNode = new UnOp(Alfabeto.NOT, Parser.parseFactor());
            } else if (Parser.tokenizer.next.type === "PARLEFT") {
                Parser.tokenizer.selectNext();
                newNode = Parser.relExpression();
                if (Parser.tokenizer.next.type === "PARRIGHT") {
                    Parser.tokenizer.selectNext();
                } else {
                    throw "ERRO5"
                }

            } else if (Parser.tokenizer.next.type === "READ") {
                Parser.tokenizer.selectNext();
                newNode = new ReadNode();
                if (Parser.tokenizer.next.type === "PARLEFT") {
                    Parser.tokenizer.selectNext();
                    if (Parser.tokenizer.next.type === "PARRIGHT") {
                        Parser.tokenizer.selectNext();
                    } else {
                        throw "ERRO5"
                    }
                } else {
                    throw "ERRO5"
                }

            }
            return newNode;

        } else {
            throw "ERRO4";
        }
    }

    static parseTerm() {
        var newNode = Parser.parseFactor();
        while (Parser.tokenizer.next.type === "MULTI" || Parser.tokenizer.next.type === "DIV" || Parser.tokenizer.next.type === "AND") {
            if (Parser.tokenizer.next.type === "MULTI") {
                Parser.tokenizer.selectNext();
                var nodeRight = Parser.parseFactor();
                var children = [newNode, nodeRight]
                newNode = new BinOp(Alfabeto.MULTI, children);
            } else if (Parser.tokenizer.next.type === "DIV") {
                Parser.tokenizer.selectNext();
                var nodeRight = Parser.parseFactor();
                var children = [newNode, nodeRight];
                newNode = new BinOp(Alfabeto.DIV, children);
            } else {
                Parser.tokenizer.selectNext();
                var nodeRight = Parser.parseFactor();
                var children = [newNode, nodeRight];
                newNode = new BinOp(Alfabeto.AND, children);
            }
        }
        return newNode;
    }

    static parseExpression() {
        var newNode = Parser.parseTerm();
        while (Parser.tokenizer.next.type === "PLUS" || Parser.tokenizer.next.type === "MINUS" || Parser.tokenizer.next.type === "OR") {
            if (Parser.tokenizer.next.type === "PLUS") {
                Parser.tokenizer.selectNext();
                var nodeRight = Parser.parseTerm();
                var children = [newNode, nodeRight];
                newNode = new BinOp(Alfabeto.PLUS, children);
            } else if (Parser.tokenizer.next.type === "MINUS") {
                Parser.tokenizer.selectNext();
                var nodeRight = Parser.parseTerm();
                var children = [newNode, nodeRight];
                newNode = new BinOp(Alfabeto.MINUS, children);
            } else if (Parser.tokenizer.next.type === "OR") {
                Parser.tokenizer.selectNext();
                var nodeRight = Parser.parseTerm();
                var children = [newNode, nodeRight];
                newNode = new BinOp(Alfabeto.OR, children);
            }
        }
        return newNode;
    }
    static relExpression() {
        
        var newNode = Parser.parseExpression();
        while (Parser.tokenizer.next.type === "EQUALEQUAL" || Parser.tokenizer.next.type === "MAIOR" || Parser.tokenizer.next.type === "MENOR" || Parser.tokenizer.next.type === "CONCAT") {
            if (Parser.tokenizer.next.type === "EQUALEQUAL") {
                Parser.tokenizer.selectNext();
                var nodeRight = Parser.parseExpression();
                var children = [newNode, nodeRight];
                newNode = new BinOp(Alfabeto.EQUALEQUAL, children);
            } else if (Parser.tokenizer.next.type === "MAIOR") {
                Parser.tokenizer.selectNext();
                var nodeRight = Parser.parseExpression();
                var children = [newNode, nodeRight];
                newNode = new BinOp(Alfabeto.MAIOR, children);
            } else if (Parser.tokenizer.next.type === "MENOR") {
                Parser.tokenizer.selectNext();
                var nodeRight = Parser.parseExpression();
                var children = [newNode, nodeRight];
                newNode = new BinOp(Alfabeto.MENOR, children);
            } else if (Parser.tokenizer.next.type === "CONCAT") {
                Parser.tokenizer.selectNext();
                var nodeRight = Parser.parseExpression();
                var children = [newNode, nodeRight];
                newNode = new BinOp(Alfabeto.CONCAT, children);
            }
        }
        return newNode;
    }

    static parseBlock() {
        if (Parser.tokenizer.next.type === "KEYLEFT") {
            Parser.tokenizer.selectNext();
            var children = [];
            while (Parser.tokenizer.next.type != "KEYRIGHT") {
                var child = Parser.parseStatement();
                children.push(child);
            }
            Parser.tokenizer.selectNext();
            const block = new BlockNode(children);
            return block;
        }
    }

    static parseStatement() {
        if (Parser.tokenizer.next.type === "ENDLINE") {
            Parser.tokenizer.selectNext();
            const noop = new NoOp()
            return noop;
        } else if (Parser.tokenizer.next.type === "IDENTIFIER") {
            const identifier = new Token("IDENTIFIER", Parser.tokenizer.next.value);
            Parser.tokenizer.selectNext();
            if (Parser.tokenizer.next.type === "EQUAL") {
                Parser.tokenizer.selectNext();
                const child = Parser.relExpression();
                const assignNode = new AssignmentsNode("equal", [identifier, child]);
                
                if (Parser.tokenizer.next.type === "ENDLINE") {
                    Parser.tokenizer.selectNext();
                    return assignNode;
                } else {
                    throw "Falta ;"
                }
            } else if(Parser.tokenizer.next.type === "PARLEFT") {
                Parser.tokenizer.selectNext();
                if(Parser.tokenizer.next.type === "PARRIGHT"){
                    Parser.tokenizer.selectNext();
                    return new FuncCall(identifier, []);
                } else {
                    var arg = [Parser.relExpression()];
                    while(Parser.tokenizer.next.type === "VIRGULA"){
                        Parser.tokenizer.selectNext();
                        arg.push(Parser.relExpression());
                    }
                    if(Parser.tokenizer.next.type === "PARRIGHT"){
                        return new FuncCall(identifier, arg);
                    } else throw "FALTAAA";

                }
            }
        } else if (Parser.tokenizer.next.type === "PRINT") {
            Parser.tokenizer.selectNext();
            if (Parser.tokenizer.next.type === "PARLEFT") {
                Parser.tokenizer.selectNext();
                const child = Parser.relExpression();
                
                if (Parser.tokenizer.next.type === "PARRIGHT") {
                    Parser.tokenizer.selectNext();
                    const print = new PrintNode(child)
                    if (Parser.tokenizer.next.type === "ENDLINE") {
                        Parser.tokenizer.selectNext();
                        return print;
                    } else {
                        throw "Falta ;"
                    }
                } else {
                    throw "Falta )"
                }
            } else {
                throw "Falta ("
            }
        } else if (Parser.tokenizer.next.type === "VAR") {
            Parser.tokenizer.selectNext();
            if (Parser.tokenizer.next.type === "IDENTIFIER") {
                let ident = [Parser.tokenizer.next.value]
                Parser.tokenizer.selectNext();
                if (Parser.tokenizer.next.type === "DOISPONTOS") {
                    Parser.tokenizer.selectNext();
                    if (Parser.tokenizer.next.type === "STRING" || Parser.tokenizer.next.type === "I32") {
                        const varNode = new VarDec(Parser.tokenizer.next.value, ident);
                        Parser.tokenizer.selectNext();
                        if(Parser.tokenizer.next.type === "ENDLINE" ){
                            return varNode;
                        } else throw "Falta ;"
                    } else {
                        throw "Falta Tipo"
                    }
                } else if (Parser.tokenizer.next.type === "VIRGULA") {
                    Parser.tokenizer.selectNext();
                    if (Parser.tokenizer.next.type === "IDENTIFIER") {
                        ident.push(Parser.tokenizer.next.value);
                        Parser.tokenizer.selectNext();
                        while (Parser.tokenizer.next.type == "VIRGULA") {
                            Parser.tokenizer.selectNext();
                            if (Parser.tokenizer.next.type === "IDENTIFIER") {
                                ident.push(Parser.tokenizer.next.value);
                                Parser.tokenizer.selectNext();
                            } else throw "ERRO ao criar var"
                        }
                        if (Parser.tokenizer.next.type === "DOISPONTOS") {
                            Parser.tokenizer.selectNext();

                            if (Parser.tokenizer.next.type === "STRING" || Parser.tokenizer.next.type === "I32") {
                                const varNode = new VarDec(Parser.tokenizer.next.value, ident);
                                Parser.tokenizer.selectNext();

                                if(Parser.tokenizer.next.type === "ENDLINE" ){
                                    return varNode;
                                } else throw "Falta ;"
                            } else {
                                throw "Falta Tipo"
                            }
                        } else throw " erro ao declarar var"
                    } else {
                        throw "Erro ao criar var"
                    }

                } else {
                    throw "Erro ao declarar var";
                }
            } else {
                throw "Erro de sintaxe ao criar variavel";
            }
        } else if (Parser.tokenizer.next.type === "RETURN"){
            Parser.tokenizer.selectNext();
            const exp = Parser.relExpression();
            if(Parser.tokenizer.next.type === "ENDLINE"){
                Parser.tokenizer.selectNext();
                return new ReturnNode([exp]);
            } else throw "FASLTA ;"
        } else if (Parser.tokenizer.next.type === "WHILE") {
            Parser.tokenizer.selectNext();
            if (Parser.tokenizer.next.type === "PARLEFT") {
                Parser.tokenizer.selectNext();
                const child = Parser.relExpression();
                if (Parser.tokenizer.next.type === "PARRIGHT") {
                    Parser.tokenizer.selectNext();
                    const childWhile = Parser.parseStatement();
                    const whileVar = new WhileNode([child, childWhile]);
                    return whileVar;
                } else {
                    throw "Falta ) no while"
                }
            }
        } else if (Parser.tokenizer.next.type === "IF") {
            Parser.tokenizer.selectNext();
            if (Parser.tokenizer.next.type === "PARLEFT") {
                Parser.tokenizer.selectNext();
                const child = Parser.relExpression();
                if (Parser.tokenizer.next.type === "PARRIGHT") {
                    Parser.tokenizer.selectNext();
                    const ifChildren = [child]
                    var childIf = Parser.parseStatement();
                    ifChildren.push(childIf);

                    if (Parser.tokenizer.next.type === "ELSE") {
                        Parser.tokenizer.selectNext();
                        const childElse = Parser.parseStatement();
                        ifChildren.push(childElse);
                    }

                    const ifNode = new IfNode(ifChildren);
                    return ifNode;

                } else {
                    throw "Falta ) no IF"
                }
            } else {
                throw "Falta ( no IF"
            }
        } else if(Parser.tokenizer.next.type === "ELSE") {
            throw "falta conteudo no if"
        } else {
            return Parser.parseBlock();
        }
    }

    static run(code) {
        Parser.tokenizer = new Tokenizer(code);
        Parser.tokenizer.selectNext();
        const tree = Parser.program();
        const result = tree.Evaluate();

        if (Parser.tokenizer.next.type != "EOF") {
            throw "erroo"
        }
        return result;
    }

}

function main(argv) {
    if (!argv[2]) {
        throw "Falta arquivo de entrada";
    }
    const filename = argv[2];

    const fs = require("fs");

    var text = fs.readFileSync(filename, 'utf8')

    const filteredString = PrePro.filter(text);

    return Parser.run(filteredString);
}

main(process.argv);
