%{

%}

%token LEFTKEY
%token RIGHTKEY
%token LEFTPAR
%token RIGHTPAR
%token EQUAL
%token AND
%token NOT
%token OR
%token EQUALEQUAL
%token MAIOR
%token MENOR
%token ENDOFSTATEMENT
%token CONCAT
%token DOISPONTOS
%token VIRGULA
%token ASPAS
%token I32
%token STRINGTYPE
%token STRING
%token IF
%token ELSE
%token WHILE
%token READ
%token PRINT
%token VAR
%token RETURN
%token FUNCTION
%token ARROW

%token IDENTIFIER
%token LETTER
%token<num> NUMBER

%token PLUS MINUS MULT DIV

%token EOL

%type type factor-recursion program declaration declaration_oprions recuringIdentifier blockStatement block relexpressionOptions relexpression expressionOptions expression termOptions term factorOptions factor varOptions elseOption statement

%start program

%%

type: 
      I32
    | STRINGTYPE
    ;
string: ASPAS STRING ASPAS;

//PROGRAM
program:
    | declaration
    ;

//DECLARATION
declaration: FUNCTION IDENTIFIER LEFTPAR declaration_oprions RIGHTPAR function_oprions block;


declaration_oprions:
    | recuringIdentifier DOISPONTOS type declaration_oprions
    ;

recuringIdentifier: IDENTIFIER
    | VIRGULA recuringIdentifier
    ;

function_oprions: 
    | ARROW type
    ;

// FUNCTION


//BLOCK
blockStatement: statement
    | statement blockStatement
    ;

block: LEFTKEY RIGHTPAR
    |  LEFTPAR blockStatement RIGHTKEY
    ;

//RELEXPRESSION
relexpressionOptions: EQUALEQUAL
    | MENOR
    | MAIOR
    | CONCAT
    ;

relexpression: expression
    |  expression relexpressionOptions relexpression

//EXPRESSION
expressionOptions:
      PLUS 
    | MINUS
    | OR
    ;

expression: term
    | term expressionOptions expression
    ;


//TERM
termOptions:
      MULT
    | DIV
    | AND
    ;

term: factor
    | factor termOptions term
    ;

//FACTOR
factorOptions:
      PLUS
    | MINUS
    | NOT   
    ;

factor-recursion: 
    | LEFTPAR relexpression RIGHTPAR
    | LEFTPAR RIGHTPAR
    ;


factor:
      NUMBER
    | string
    | IDENTIFIER factor-recursion
    | factorOptions factor
    | LEFTPAR relexpression RIGHTPAR
    | READ LEFTPAR RIGHTPAR ENDOFSTATEMENT
    ;

//STATEMENT
varOptions:
    IDENTIFIER
    | IDENTIFIER VIRGULA IDENTIFIER
    ;

elseOption:
    | ELSE statement
    ;

statement:
      ENDOFSTATEMENT
    | IDENTIFIER EQUAL relexpression ENDOFSTATEMENT
    | RETURN relexpression ENDOFSTATEMENT
    | IDENTIFIER factor-recursion ENDOFSTATEMENT
    | PRINT LEFTPAR relexpression RIGHTPAR ENDOFSTATEMENT
    | VAR varOptions DOISPONTOS type ENDOFSTATEMENT
    | WHILE LEFTPAR relexpression RIGHTPAR statement
    | block
    | IF LEFTPAR relexpression RIGHTPAR statement elseOption 
    ;

%%

int main() {
    yyparse();

    return 0;
}

yyerror(char* s) {
    printf("ERROR: %s\n", s);
    return 0;
}
