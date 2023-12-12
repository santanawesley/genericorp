# Genericorp

Genericorp - Produtos Genéricos

## Visão Geral

Esse é um projeto-teste ficticio que simula o website responsivo de uma empresa de produtos genéricos.<br/>
As funcionalidades aqui presentes vão além do solicitado e ainda serão mais ampliadas.

## Tecnologias Utilizadas

- HTML5
- SASS
- JavaScript
- React
- TypeScript
- Material-UI
- toastify
- Regex

## Funcionalidades Principais

1. **Página Home:** Apresentação de 50 produtos.
2. **Detalhes do Produto:** Páginas com informações detalhadas de cada item.
3. **Sistema de Autenticação:** Cadastro, login (persistência) e logout.
4. **Recursos Condicionados ao Login:** Favoritos e Checkout.
5. **Tratamento de Erros nos Formulários:** Mensagens de erro implementadas.
6. **Feedback de Sucesso ou Erro:** Popups de confirmação.
7. **Mensagem sobre o Uso de Cookies:** Notificação sobre cookies.
8. **Filtro de Produtos:** Por favoritos e busca por nome.
9. **Gerenciamento de estado:** Utilização de hooks (useContext).

## Observações

As imagens são aleatórias e adquiridas pelo site https://picsum.photos/, porém uma vez adquiridas de forma aleatória elas se mantem fixas conforme a montagem dos produtos.<br/>
Tantos os valores qto os nomes e descrições são semialetórios. São definidas palavras/letras chaves e a partir delas são montadas aleatoriamente os valores (com limites de tamanhos).

Toda a parte de login e logout foi feita sem o uso do materia-UI de forma proposital, apenas para demonstrar a possibilidade do projeto sem o uso dessa biblioteca.

Na finalização da compra é disponibilizado um JSON com os dados da compra e do usuário, para caso houvesse uma api, ser enviado.

## Demonstração

Link para o projeto implantado: [Link para o Projeto](https://genericorp.netlify.app/)

## Próximos Passos

- Devido ao prazo e metas para esse projeto, mesmo sendo contrário ao ideal, ele foi feito sem testes unitários, contudo em breve adicionarei eles com Jest.
- Alteração de estrutura na apresentação da página inicial.

## Instalação e Uso

### Pré-requisitos

Certifique-se de ter instalado na sua máquina:

- Node.js (versão 12 ou superior)
- Git

### Passos

1. **Clone o Repositório**
   git clone https://github.com/santanawesley/genericorp.git

2. Acesse o Diretório
   cd genericorp

3. Instale as Dependências
   npm install

4. Inicie o Servidor de Desenvolvimento
   npm start

5. Visualize no Navegador
   O projeto estará disponível em http://localhost:3000.

Comandos Disponíveis:<br/>
npm start: Inicia o servidor de desenvolvimento.<br/>
npm run sass: Compila arquivos SASS para CSS.<br/>
npm run build: Cria uma versão de produção do projeto.

## Autor

Wesley R. de Santana - wesley0807@gmail.com
