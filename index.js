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

const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.PASSWORD}@cluster0.hjkzu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const equipments = client.db("Edge_Sporty").collection("equipments");
    //Create Data
    app.post("/equipments", async (req, res) => {
      const result = await equipments.insertOne(req.body);
      res.send(result);
    });

    //Get Data
    app.get("/equipments", async (req, res) => {
      const result = await equipments.find().toArray();
      res.send(result);
    });

    //Get Single Data by _id
    app.get("/equipments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await equipments.findOne(query);
      res.send(result);
    });

    //Get Single Data by Email
    app.get("/equipments/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email:email };
      const result = await equipments.findOne(filter);
      res.send(result);
    });

    //Update Data by _id
    app.put("/equipments/:id", async (req, res) => {
      const id = req.params.id;
      const {
        image,
        equipmentsName,
        categoryName,
        description,
        price,
        rating,
        customization,
        processingTime,
        stockStatus,
        userEmail,
        userName,
      } = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const setEquipment = {
        $set: {
          image:image,
          equipmentsName:equipmentsName,
          categoryName:categoryName,
          description:description,
          price:price,
          rating:rating,
          customization:customization,
          processingTime:processingTime,
          stockStatus:stockStatus,
          userEmail:userEmail,
          userName:userName
        },
      };
      const result = await equipments.updateOne(query, setEquipment, options);
      res.send(result);
    });

    //Delete Data
    app.delete("/equipments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await equipments.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("Server is running on ", port);
});
