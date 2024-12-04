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

   
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("Server is running on ", port);
});
