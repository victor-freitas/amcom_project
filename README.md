# AmcomProject Sales Controller

Bem-vindo!

## Descrição

Este projeto é uma aplicação web que cadastra itens pelo django admin, tais como produto, vendedor, cliente etc. e pelo #front tem um control de criação, listagem, remoçao de vendas e comissionamento..

## Pré-requisitos

Antes de começar, verifique se você atende aos seguintes requisitos:

- [Python](https://www.python.org/downloads/): É necessário ter o Python instalado.`requirements.txt`.
- [Django](https://www.djangoproject.com/): É necessário ter o Django instalado.
- [Django Rest Framework](https://www.django-rest-framework.org/): É necessário ter o Django Rest Framework instalado.
- [Node.js](https://nodejs.org/): É necessário ter o Node.js instalado.
- [npm](https://www.npmjs.com/): É necessário ter o npm (gerenciador de pacotes do Node.js) instalado.

## Instalação

```bash
```    
```bash
```
    
```bash
```
    


    
Siga estas etapas para instalar e executar o projeto:

1. Clone o repositório:

```bash
git clone git@github.com:victor-freitas/amcom_project.git

```
2. Ative a venv
```bash
    source venv/bin/activate
```
3. Instale os requirements
```bash
    pip3 install -r requirements.txt
```
4. Faça as migrations
```bash
    make makemigrations
    make migrate
```
5. Criar um superuser
```bash
    make createsuperuser
```
6. Rodar a aplicação do django para API
```bash
    make runserver
```
7. Pasta frontend
```bash
    cd sales_controller/frontend/
```
8. Install nvm
```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
    nvm install 16
    nvm use 16
```
9. Install react-scripts
```bash
    npm install --save-dev react-scripts
```
10. Se tiver problemas com instalação remover a pasta node_modules e o arquivo package-lock.json:
```bash
    rm -rf node_modules package-lock.json
    npm install
```
11. Para rodar o frontend
```bash
    npm start
```
    

Uso
Acesse a aplicação em seu navegador:

Front-end: http://localhost:3000/
API Django: http://localhost:8080/api/
Django admin: http://localhost:8080/admin/