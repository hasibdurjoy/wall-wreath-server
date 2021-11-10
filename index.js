const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
// const admin = require("firebase-admin");
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
// const admin = require("firebase-admin");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yohkm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('wall-wreath');
        const productCollection = database.collection('products');

        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.json(products);
        });

        app.get('/products/:id', async (req, res) => {
            console.log(req.params.id);
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await productCollection.findOne(query);
            res.json(product);
        });
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello wall wreath!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})