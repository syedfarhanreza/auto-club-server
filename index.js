const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0neovd0.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('unauthorized access');
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next();
    })

}

async function run(){
    try{
        const audiCollection = client.db('autoClub').collection('audiCars');
        const hondaCollection = client.db('autoClub').collection('hondaCars');
        const benzCollection = client.db('autoClub').collection('benzCars');
        const usersCollection = client.db('autoClub').collection('users');
        const bookingsCollection = client.db('autoClub').collection('booking');

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

        app.post('/audis', async (req, res) => {
            const data = req.body;
            const result = await audiCollection.insertOne(data);
            res.send(result);
        });
        app.post('/hondas', async (req, res) => {
            const data = req.body;
            const result = await hondaCollection.insertOne(data);
            res.send(result);
        });
        app.post('/mercedess', async (req, res) => {
            const data = req.body;
            const result = await benzCollection.insertOne(data);
            res.send(result);
        });

        app.get('/jwt', async(req, res) => {
            const email = req.query.email;
            const query = {email: email}
            const user = await usersCollection.findOne(query);
            if(user){
                const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn: '7d'})
                return res.send({accessToken: token})
            }
            res.status(403).send({accessToken: ''})
        });

        app.get('/users', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/user', async (req, res) => {
            const role = req.query.role;
            const query = { role: role };
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        app.get('/bookings', verifyJWT, async (req, res) => {
            const email = req.query.email;
            console.log('token',req.headers.authorization);
            const decodedEmail = req.decoded.email;

            if (email !== decodedEmail) {
                return res.status(403).send({ message: 'forbidden access' });
            }

            const query = { email: email };
            const result = await bookingsCollection.find(query).toArray();
            res.send(result);
        });


        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            console.log(booking);
            const result = await bookingsCollection.insertOne(booking);
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

