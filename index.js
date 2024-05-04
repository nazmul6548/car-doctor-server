const express = require('express')
const cors = require('cors')
require("dotenv").config()
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');






app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS);



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ce00xrg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const serviceCollection = client.db('carDoctor').collection('servicesCar');
    const bookingCollection = client.db('carDoctors').collection('bookingsCar');

    app.get("/services",async(req,res) => {
        const cursor = serviceCollection.find()
        const result = await cursor.toArray();
        res.send(result)
    })


    app.get('/services/:id',async (req,res) => {
      const id = req.params.id;
      const query = {_id:new ObjectId(id)};
      const options ={
        projection : {title:1,description:1,price:1,img:1},
      }
      const result = await serviceCollection.findOne(query,options);
      res.send(result);
    })

    // booking cars

    app.get("/booking",async (req,res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query ={email:req.query.email}
      }
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    })

    app.post("/booking",async(req,res)=>{
      const booking = req.body;
      console.log(booking);
      const result = await bookingCollection.insertOne(booking);
      res.send(result);

    })

    app.delete('/booking/:id',async(req,res) => {
      const booking = req.params.id;
      // console.log(booking);
      const query = {_id:new ObjectId(booking)};
      const result = await bookingCollection.deleteOne(query);
      res.send(result)
    })
   
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);



app.get('/' ,(req,res)=>{
    res.send("doctor is running")
})

app.listen(port,()=>{
    console.log(`car doctor is listening on ${port}`);
})