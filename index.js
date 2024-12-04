require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {
  MongoClient,
  ServerApiVersion,
  Collection,
  ObjectId,
} = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server running Fine!");
});

// const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.PASSWORD}@cluster0.hjkzu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const products = client.db("Edge_Sporty").collection("products");
    //Create Data
    app.post("/products", async (req, res) => {
      const result = await products.insertOne(req.body);
      res.send(result);
    });

    //Get Data
    app.get("/products", async (req, res) => {
      const result = await products.find().toArray();
      res.send(result);
    });

    //Get Single Data by _id
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await products.findOne(query);
      res.send(result);
    });

    //Get Single Data by Email
    app.get("/products/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email:email };
      const result = await products.findOne(filter);
      res.send(result);
    });

    //Update Data by _id
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const {
        equipmentName,
        categoryName,
        description,
        customization,
        processingTime,
        stockStatus,
        price,
        rating,
        image,
      } = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const setEquipment = {
        $set: {
          userName:userName,
          userEmail:userEmail,
          equipmentName:equipmentName,
          categoryName:categoryName,
          description:description,
          customization:customization,
          processingTime:processingTime,
          stockStatus:stockStatus,
          price:price,
          rating:rating,
          image:image
        },
      };
      const result = await products.updateOne(query, setEquipment, options);
      res.send(result);
    });

    //Delete Data
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await products.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("Server is running on ", port);
});
