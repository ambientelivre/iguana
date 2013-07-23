

Parametros de Conexão.

Driver Class org.hsqldb.jdbcDriver
userName : pentaho_user
senha: password
URL: jdbc:hsqldb:hsql://localhost:9001/hibernate





Segue um exemplo de dashboard pra alteração de senha. É uma implementação antiga. Pode não ser a ideal, mas é um bom ponto de partida.

Requisitos:

    JNDI 'hibernate' apontando para base do Pentaho. (2012-08-23: Antigamente desenvolvi com esse JNDI 'hibernate', mas vc pode simplesmente utilizar 'Hibernate', com H maiúsculo, para pegar a conexão já disponível, sem precisar criar nova entrada)
    Alterar, dentro de template_senha.html, variáveis de cabeçalho: solucao e caminho, com pasta onde vai ficar o dashboard;
    Verificar execução de queries no que toca à sensitividade de case do banco hibernate que o Pentaho está utilizando.

Descrição dos arquivos:

alterarsenha.xcdf - Arquivo do Dashboard (166 Bytes)  Marcello Pontes, 20/10/2011 16:16

template_senha.html - Template do Dashboard (10,5 KB)  Marcello Pontes, 20/10/2011 16:16

X.xaction - Arquivo que carrega senha do usuário criptografada para validação de formulário (2,3 KB)  Marcello Pontes, 20/10/2011 16:16

Xa.xaction - Arquivo que realiza segunda validação de dados e altera senha do usuário no banco (4,2 KB)  Marcello Pontes, 20/10/2011 16:16


Sintam-se livres para melhorar essa solução

Jira para cache de senha: http://jira.pentaho.com/browse/BISERVER-7427

Abraços,

Marcello Pontes 
