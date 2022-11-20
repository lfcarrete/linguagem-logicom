# EBNF Linguagem

IF = i;

ELSE = e;

WHILE = w;

READ = l;

PRINT = p;

VAR = v;

RETURN = r;

FN = f;

TYPE = t | n;

NUMBER = DIGIT, {DIGIT};

LETTER = ( a | ... | z | A | ... | Z ) ;

STRING = """, (LETTER | DIGIT), {LETTER | DIGIT}, """;

PROGRAM = LAMBDA | DECLARATION ;

DECLARATION = FN, IDENTIFIER, "(", [ DDECLARATIONOPTIONS ], ")", ["->", TYPE], BLOCK;

DDECLARATIONOPTIONS = {IDENTIFIER, {"," IDENTIFIER}}, ":" TYPE, {",",  IDENTIFIER, {"," IDENTIFIER}}, ":" TYPE;

FUNCTION = TYPE, IDENTIFIER, "(" [IDENTIFIER {"," IDENTIFIER}] ")", "{", { Statement }, RETURN, {DIGIT | IDENTIFIER } , ";" , "}";

IDENTIFIER = LETTER, { LETTER | DIGIT | "_" } ;

DIGIT = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 ;

BLOCK = "{", {STATEMENT}, "}";

RELEXPR = EXPRESSION, {("==", "<", ">", "."), EXPRESSION};

EXPRESSION = TERM, {("+", "-", "||"), TERM};

TERM = FACTOR, {("*", "/", "&&"), FACTOR}

FACTOR = NUMBER | STRING | IDENTIFIER, ["(", [{RELEXPR ","}], ")"] | ("+", "-", "!",) FACTOR | "(" RELEXPR ")" | READ  "(" ")";

STATEMENT = ";" | IDENTIFIER, "=", RELEXPR | RETURN, RELEXPR, ";" | IDENTIFIER, ["(", [{RELEXPR ","}], ")"], ";" | PRINT "(" RELEXPR ")" ";" | VAR IDENTIFIER {"," ,IDENTIFIER} ":" TYPE ";" | WHILE "(" RELEXPR ")" STATEMENT | BLOCK | IF "(" RELEXPR ")" STATEMENT [ELSE STATEMENT];

