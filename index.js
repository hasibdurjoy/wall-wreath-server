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
        const bookingCollection = database.collection('bookings');
        const reviewCollection = database.collection('reviews');
        const usersCollection = database.collection('users');

        //get

        //GET ALL PRODUCTS
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.json(products);
        });

        //GET  PRODUCTS BY ID
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await productCollection.findOne(query);
            res.json(product);
        });

        //GET  PRODUCTS BY ID
        app.get('/manageProducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await productCollection.findOne(query);
            res.json(product);
        });

        //GET  BOOKINGS BY QUERY
        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = bookingCollection.find(query);
            const bookings = await cursor.toArray();
            res.json(bookings);
        });

        //GET  ALL BOOKINGS
        app.get('/allBookings', async (req, res) => {
            const cursor = bookingCollection.find({});
            const bookings = await cursor.toArray();
            res.json(bookings);
        });

        //GET  ALL REVIEWS
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.json(reviews);
        });

        //GET  USERS WHO ARE ADMIN
        app.get('/users', async (req, res) => {
            const role = req.query.role;

            const query = { role: role }

            const cursor = usersCollection.find(query);
            const users = await cursor.toArray();
            res.json(users);
        });

        //GET  USERS BY IS
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            console.log(user?.role);
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        //POST

        //ADD NEW PRODUCT
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.json(result)
        });

        //ADD NEW USER
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result)
        });

        //ADD NEW BOOKING
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.json(result)
        });

        //ADD NEW REVIEW
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result)
        });

        //PUT

        //ADD NEW USER IF NOT HAVE
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        //MAKE ADMIN
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

        //UPDATE BOOKING
        app.put('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const updateDoc = {
                $set: { status: "approved" }
            };
            const result = await bookingCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

        //UPDATE PRODUCT
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const product = req.body;
            const filter = { _id: ObjectId(id) }
            const updateDoc = {
                $set: { ...product }
            };
            const result = await productCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

        //DELETE

        //DELETE BOOKING
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.json(result);
        });

        //DELETE PRODUCT
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.json(result);
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