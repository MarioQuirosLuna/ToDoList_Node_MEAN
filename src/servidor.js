var express = require('express');
var app = express();
var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:s9aHCNbT952spYg@cluster0.ghwz8we.mongodb.net/?retryWrites=true&w=majority');

var Lista = mongoose.model('Lista', {
    texto: String
});

app.get('*', function (req, res) {
    res.send('hello world');
})

app.listen(8080, function () {
    console.log('Servidor escuchando en el puerto 8080');
});