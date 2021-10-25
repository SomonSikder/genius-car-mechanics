const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const cors = require('cors');
require('dotenv').config({path: './.env'})

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zetdm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");

        // Get Api
        app.get('/services', async (req, res)=>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray()
            res.json(services)
        })   

        // Get single Api
        app.get('/services/:id', async (req, res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const service = await servicesCollection.findOne(query)
            res.json(service)
        })   

        // Post API
        app.post('/services', async (req, res)=>{
                const service = req.body
                const result = await servicesCollection.insertOne(service)
            res.json(result)
        })

        // Delete Api
        app.delete('/services/:id', async (req, res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const service = await servicesCollection.deleteOne(query)
            res.json(service)
        })

    }
    finally {
    //   await client.close();
    }
}
run().catch(console.dir);




app.listen(PORT, ()=>{
    console.log("Server is runing on PORT", PORT)
})