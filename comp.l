%{
    #include "comp.tab.h"
%}

%%

"+"  {return PLUS;}
"-"  {return MINUS;}
"*"  {return MULT;}
"/"  {return DIV;}

"="  {return EQUAL;}

"&&" {return AND;}
"||" {return OR;}
"!"  {return NOT;}
"==" {return EQUALEQUAL;}

">" {return MAIOR;}
"<" {return MENOR;}

"{"  {return LEFTKEY;}
"}"  {return LEFTPAR;}
"("  {return LEFTPAR;}
")"  {return RIGHTPAR;}
";"  {return ENDOFSTATEMENT;}
"."  {return CONCAT;}
":"  {return DOISPONTOS;}

"String" {return STRINGTYPE;}
"i32" {return I32;}
","  {return VIRGULA;}
"\"" {return ASPAS;}
"->" {return ARROW;}


"ret" {return RETURN;}
"i"  {return IF;}
"e"  {return ELSE;}
"w"  {return WHILE;}
"r"  {return READ;}
"p"  {return PRINT;}
"v"  {return VAR;}
"f"  {return FUNCTION;}

[0-9]+ { return NUMBER;}
^[a-zA-Z]{1}[a-zA-Z0-9_]* {return IDENTIFIER;}
[a-zA-Z0-9$&+,:;=?@#|'<>.^*()%!-]* {return STRING;}

\n {return EOL;}
[ \t] {}

%%

yywrap() {}

