// configurando o servidor
const express = require("express");
const server = express();

// configurar o servidor para apresentar arquivos estáticos
server.use(express.static('assets'));

// habilitar body do formulário
server.use(express.urlencoded({
    extended: true
}));

// configurando a conexão com o banco de dados
const mysql = require('mysql');
const db = new mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'bloodbank',
});

// configurando a template engine
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
    express: server,
    noCache: true,
});

// configurar a apresentação da página
server.get("/", function (req, res) {

    const query = `SELECT * FROM donors`;

    db.query(query, function (err, result) {
        if (err)
            return res.send("Erro de banco de dados!");

        const donors = result;

        return res.render("index.html", {
            donors
        });
    });


});

server.post("/", function (req, res) {
    //pegar dados do formulário
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios!")
    }
    // coloco os valores dentro do banco de dados.
    const query = `INSERT INTO donors (name, email, blood) VALUES (?, ?, ?)`;

    const values = [name, email, blood];

    db.query(query, values, function (err) {
        if (err)
            return res.send("Erro cadastro no banco de dados!");

        return res.redirect("/");
    });

});


// ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function () {
    console.log("Iniciei o servidor!");
});