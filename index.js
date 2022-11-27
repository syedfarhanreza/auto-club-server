const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0neovd0.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const audiCollection = client.db('autoClub').collection('audiCars');
        const hondaCollection = client.db('autoClub').collection('hondaCars');
        const benzCollection = client.db('autoClub').collection('benzCars');
        const usersCollection = client.db('autoClub').collection('users');

        app.get('/audis', async (req, res) => {
            const query = {};
            const result = await audiCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/hondas', async (req, res) => {
            const query = {};
            const result = await hondaCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/mercedess', async (req, res) => {
            const query = {};
            const result = await benzCollection.find(query).toArray();
            res.send(result);
        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });
    }
    finally{    

    }
}
run().catch(console.log)


app.get('/', async(req, res) => {
    res.send('AutoClub server is running')
})

app.listen(port, () => console.log(`AutoClub running on ${port}`))

