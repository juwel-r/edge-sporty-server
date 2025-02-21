require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running Fine!");
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
    const taskFlow = client.db("task-flow");
    const userCollection = taskFlow.collection("userCollection");
    const taskCollection = taskFlow.collection("taskCollection");

    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
      console.log(result);
    });

    app.post("/users", async (req, res) => {
      const userId =
        "TF" +
        ((await userCollection.countDocuments()) + 1)
          .toString()
          .padStart(4, "0");
      console.log(userId);
      const userData = req.body;
      userData.UID = userId;
      const isExist = await userCollection.findOne({ email: userData.email });
      if (isExist || !userData.email) return res.send({ isExist: true });
      const result = await userCollection.insertOne(userData);
      res.send(result);
    });

    // task
    app.get("/task", async (req, res) => {
      const { category } = req.query;
      let filter = {};
      if (category) {
        filter.category = category;
      }
      console.log(category, filter);
      const result = await taskCollection.find(filter).toArray();
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("Server is running on: ", port);
});
