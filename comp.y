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

%token IDENTIFIER
%token LETTER
%token<num> NUMBER

%token PLUS MINUS MULT DIV

%token EOL

%type type params funcBlock function blockStatement block relexpressionOptions relexpression expressionOptions expression termOptions term factorOptions factor varOptions elseOption statement

%%

type: 
      I32
    | STRINGTYPE
    ;
string: ASPAS STRING ASPAS;

// FUNCTION
params:
    | IDENTIFIER
    | IDENTIFIER VIRGULA params
    ;

funcBlock: RETURN IDENTIFIER ENDOFSTATEMENT
    | RETURN NUMBER ENDOFSTATEMENT
    | statement funcBlock
    ;

function: type IDENTIFIER LEFTPAR params RIGHTPAR LEFTKEY funcBlock RIGHTKEY ENDOFSTATEMENT;

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

factor:
      NUMBER
    | string
    | IDENTIFIER
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
    | IDENTIFIER ENDOFSTATEMENT
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
