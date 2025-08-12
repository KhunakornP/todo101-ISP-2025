const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 15000;

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/todos'

app.use(cors());
app.use(express.json());

const Task = mongoose.model('Task', new mongoose.Schema({
    text: String,
    completed: Boolean
}));

app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
})

app.post('/tasks', async (req, res) => {
    const tasks = await Task.create(req.body);
    res.json(tasks);
})

app.put('/tasks/:id', async (req, res) => {
    const tasks = await Task.findByIdAndUpdate(req.params.id, req.body);
    console.log(req)
    res.json(tasks);
})

app.delete('/tasks/:id', async (req, res) => {
    const tasks = await Task.findByIdAndDelete(req.params.id);
    console.log(req)
    res.sendStatus(204)
})

const connectToDB = () => {
    console.log("Trying to connect to MongoDB...")
    mongoose.connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
      .then(() => {
        console.log('Mongo connected')
        app.listen(port, () => {
            console.log(`app running on port ${port}`)
        })
      })
      .catch( err => {
        console.log('DB go BOOOM');
        setTimeout(connectWithRetry, 500);
      })
}

connectToDB()