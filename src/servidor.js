require('dotenv').config()

var express = require('express');
var cors = require('cors')
var app = express();
var mongoose = require('mongoose');

app.use(cors())
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Database connected'))
    .catch(err => console.log('Error: ' + err.message));

process.on('uncaughtException', (error) => {
    console.error(error, 'DB disconnected')
    mongoose.disconnect()
})

var List = mongoose.model('List', {
    text: String,
    done: Boolean
});


app.post('/api/list', async (req, res) => {
    const { text } = req.body;
    try {
        let newTask = new List({ text });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.send(error.message);
    }
});

app.get('/api/list', async (req, res) => {
    try {
        const list = await List.find({});
        res.status(200).json(list);
    } catch (error) {
        res.send(error.message);
    }
});

app.delete('/api/list/:id', async (req, res) => {
    const {
        id
    } = req.params
    List.deleteOne({
        _id: id
    }).then(res.status(200).send({
        deleted: `Task with id ${id} deleted`
    })).catch(err => {
        res.status(500).send({
            error: err
        });
    });
});

app.put('/api/list/:id', async (req, res) => {
    const { id } = req.params
    const { text } = req.body

    List.findOneAndUpdate(
        { _id: id },
        { text: text },
        { done: true }
    ).then(list => {
        res.status(200).send({
            updated: `Task with id ${id} updated`
        });
    }).catch(err => {
        res.status(500).send({
            error: err.message
        });
    });
});


app.get('*', function (req, res) {
    res.send('hello world');
});

app.listen(8080, function () {
    console.log('Servidor escuchando en el puerto 8080');
});