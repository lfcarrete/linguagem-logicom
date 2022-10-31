# EBNF Linguagem

IF = i;
ELSE = e;
WHILE = w;
READ = r;
PRINT = p;

TYPE = String | i32;

NUMBER = DIGIT, {DIGIT};

LETTER = ( a | ... | z | A | ... | Z ) ;

STRING = """ (LETTER | DIGIT), {LETTER | DIGIT} """;

IDENTIFIER = LETTER, { LETTER | DIGIT | "_" } ;

DIGIT = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 ;

BLOCK = "{", {STATEMENT}, "}";

RELEXPR = EXPRESSION, {("==", "<", ">", "."), EXPRESSION};

EXPRESSION = TERM, {("+", "-", "||"), TERM};

TERM = FACTOR, {("*", "/", "&&"), FACTOR}

FACTOR = NUMBER | STRING | IDENTIFIER | ("+", "-", "!",) FACTOR | "(" RELEXPR ")" | READ  "(" ")";

STATEMENT = ";" | IDENTIFIER ";" | PRINT "(" RELEXPR ")" ";" | VAR IDENTIFIER {"," ,IDENTIFIER} ":" TYPE ";" | WHILE "(" RELEXPR ")" STATEMENT | BLOCK | IF "(" RELEXPR ")" STATEMENT [ELSE STATEMENT];

