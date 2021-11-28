<p align="center">
  <img width="auto" height="210em" src="https://raw.githubusercontent.com/andersonzeroone/legged-angels/main/src/assets/logoV.png">
</p>


<h3 align="center">🚧 Software em construção 🚧</h3>
<p align="center">
  <img width="auto" height="23em" src="https://img.shields.io/badge/JavaScript-323330?style=flat&logo=javascript&logoColor=F7DF1E" >
  <img width="auto" height="23em" src="https://img.shields.io/badge/-TypeScript-323330?style=flat&logo=TypeScript">
  <img width="auto" height="23em" src="https://img.shields.io/badge/Node.js-323330?style=flat&logo=Node.js&logoColor=white">
  <img width="auto" height="23em" src="https://img.shields.io/badge/Express.js-323330?style=flate">
  <img width="auto" height="23em" src="https://img.shields.io/badge/PostgreSQL-323330?style=flate&logo=postgresql&logoColor=white">
</p>

# Sumario 
* [Sobre](#sobre)
* [Pré-Requisito](#pré-requisito)
* [Executando o projeto](#executando-o-projeto)
  * <a href="#downCod">Baixando e configurando o código</a> 
  * <a href="#execAmbDev">Executando Ambiente de desenvolvimento</a>
  * <a href="#execTest">Executando Testes</a>
* [Build](#build)
* [Documentação](#documentação)
* [Tecnologias](#tecnologias)
* [Autores](#autores)

<br> 

___
# Sobre

<br> 
<p align="justify">O Legged Angels foi desenvolvido com a intenção de ajudar pets (animais de estimação como cachorro e gato) que estão em situação de vulnerabilidade a encontrarem um novo lar. Tanto pessoas como ONGS podem cadastrar esse pet. Além disso, o Legged Angels, permite que pessoas possam encontrar seu pet perdido, fazendo o cadastro dele ou encontrando no sistema se já tiver sido cadastrado com o status de perdido por outra pessoa. É também possível visualizar ONGS na sua região através do mapa na nossa página inicial.</p>

<p align="center">
  <img width="auto" height="200em" src="https://raw.githubusercontent.com/andersonzeroone/legged-angels/main/src/assets/img00.png">
  <img width="auto" height="200em" src="https://raw.githubusercontent.com/andersonzeroone/legged-angels/main/src/assets/img01.png">
  <img width="auto" height="200em" src="https://raw.githubusercontent.com/andersonzeroone/legged-angels/main/src/assets/img02.png">
  <img width="auto" height="200em" src="https://raw.githubusercontent.com/andersonzeroone/legged-angels/main/src/assets/img03.png"
</p>

---
# Pré-Requisito

<br> 

  Você vai precisar ter instalado em sua máquina as seguintes ferramentas:

  * [NojeJS](https://nodejs.org/en/) (Pelo menos versão 14.15 ou superior): Runtime de JS no servidor;
  * [PostgreSQL](https://www.postgresql.org/): Banco de dados utilizado no projeto;
  * [yarn](https://yarnpkg.com/): Gerenciador de pacote;
  * [Nodemon](https://nodemon.io/) (ferramenta para ambiente de desenvolvimento): Uma maneira da API atualizar sozinha sem precisar reiniciar.

<p align="justify">Caso deseje baixar o código fonte, para que apareça as telas é necessário clonar o front-end do projeto que pode ser acessada neste <a href="https://github.com/andersonzeroone/legged-angels">link</a> e fazer ela rodar, aqui é apenas a API.</p>



<br> 

---
# Executando o projeto

<h2 align="center">Baixando e configurando o código <a name="downCod"></a></h2>

<br> 

<strong>1 - </strong>  Clone este repositório:

```bash
$ git clone https://github.com/araujo21x/API_adocao_animais.git
```

<strong>2 - </strong>  Acesse a pasta do projeto no terminal/cmd:
```bash
$ cd API_adocao_animais/
```

<strong>3 - </strong>  Instale as dependências do projeto:
```bash
$ yarn install
```

<strong>4 - </strong> Configurando as variáveis de ambiente (ambiente produção = .env)

1. Crie uma copia do arquivo exemple.env;

2. Modifique o nome dessa copia para .env;

3. O arquivo .env vai ter descrições de como preenchê-lo.
```
Não utilize os dados do ambiente de produção(.env) no ambiente de desenvolvimento (.env.test).
```

<strong>5 - </strong>  Configurando as variáveis de ambiente (ambiente desenvolvimento = .env.test)

1. Crie uma copia do arquivo exemple.env;

2. Modifique o nome dessa copia para .env.test;

3. O arquivo .env.test vai ter descrições de como preenchê-lo. 

```
Não utilize os dados do ambiente de produção(.env) no ambiente de desenvolvimento (.env.test).
```

<h2 align="center">Executando <br> ---- Ambiente de desenvolvimento ---- <a name="execAmbDev"></a></h2>

<br> 

<strong> 1 - </strong> Comando para rodar o projeto, no ambiente de desenvolvimento:
```bash
$ yarn dev
```

<h2 align="center">Executando <br> ---- Testes ---- <a name="execTest"></a></h2>

<br> 

<strong> 1 - </strong> Comando para rodar os testes:
```
OBS: CUIDADO!!!
* CUIDADO!!! Este comando é configurando para limpar o banco de dados, fazer upload de imagens e fazer o insert de todos os dados necessário para rodar os testes.
* CUIDADO!!! O teste está configurado para rodar no ambiente de desenvolvimento por padrão, não mude isso.
```

```bash
$ yarn test
```

<br> 

___
# Build


<br> 

O código está em <strong>TypeScript</strong>, mas somente para o desenvolvimento. Dessa maneira será necessario fazer o <strong>build</strong> em alguns momento, por exemplo, quando for fazer deploy. Build é o processo de transforma o código de <strong>TypeScript</strong> para <strong>JavaScript</strong>. 
<br> <p>Os servidores já estão configurados para fazer o build de maneira automática, mas caso necessite fazer os comandos são esses:.</p>

1. Buildar:
```bash
$ yarn build
```
2. Rodar o projeto <strong>JavaScript</strong>:
```bash
$ yarn start
```

<br> 

___
# Documentação 

___
# Tecnologias 

<br> 

- [Express](https://expressjs.com/pt-br/): Framework para NodeJS;
- [JestJS](https://jestjs.io/pt-BR/)(dev): Ferramenta para teste
- [Supertest](https://www.npmjs.com/package/supertest)(dev): Ferramenta para teste
- [Nodemon](https://nodemon.io/)(dev): Uma maneira da API atualizar sozinha sem 
precisar reiniciar no ambiente de desenvolvimento;
- [TypeScript](https://www.typescriptlang.org/)(dev): Superset para JS;
- [ESLint](https://eslint.org/)(dev): Ferramenta para patronizar o código;
- [Cloudinary](https://cloudinary.com/): Serviço de armazenamento da para imagem;
- [Compression](https://www.npmjs.com/package/compression): Serve para comprimir 
as resposta da API;
- [Typeorm](https://typeorm.io/#/): ORM para NodeJS;
- [pg](https://www.npmjs.com/package/pg): Dependência para lidar com o banco
- [Nodemailer](https://nodemailer.com/about/): Serviço para envio de e-mail;
- [dotenv](https://www.npmjs.com/package/dotenv): Variável ambiente;
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): JWT, autenticação;
- [multer](https://www.npmjs.com/package/multer): Serviço trabalhar com imagem enviado para o servidor;
- [helmet](https://www.npmjs.com/package/helmet): Ajuda na segurança da aplicação configurando o cabeçalho http da resposta da API;
- [cors](https://www.npmjs.com/package/cors): Habilitar o cors.

### Veja o arquivo [package.json](https://github.com/araujo21x/API_adocao_animais/blob/master/package.json)

<br> 

___
# Autores 

### Lucas de Araujo Cirqueira(desenvolveu o back-end):
* [GitHub](https://github.com/araujo21x);
* [LinkedIn](https://www.linkedin.com/in/lucas-araujo-cirqueira-a1402519b/)

### Anderson Pablo(desenvolveu o front-end):
* [GitHub](https://github.com/andersonzeroone);
* [LinkedIn](https://www.linkedin.com/in/anderson-pablo-js/)

