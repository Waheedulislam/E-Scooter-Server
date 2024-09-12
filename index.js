const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t72pw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    // scooter
    const scootersCollection = client
      .db("scooters")
      .collection("scootersCollection");
    // Users
    const usersCollection = client.db("UsersDB").collection("Users");
    // Users
    const cartsCollection = client.db("CartsDB").collection("Carts");

    ////////////////////// User Collection ////////////////////////
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const query = { email: user?.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({
          massage: "User Already Exists",
          insertedIn: null,
        });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    ////////////////////// Scooters Collection ////////////////////////
    app.get("/scooters", async (req, res) => {
      const scooterData = scootersCollection.find();
      const result = await scooterData.toArray();

      res.send(result);
    });

    ////////////////////// Carts Collection ////////////////////////
    app.get("/carts", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await cartsCollection.find(query).toArray();
      res.send(result);
    });
    app.post("/carts", async (req, res) => {
      const cartData = req.body;
      const result = await cartsCollection.insertOne(cartData);
      res.send(result);
    });

    console.log("successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Route  is Working");
});

app.listen(port, () => {
  console.log(`App listening on port : ${port}`);
});

// pass :6nWblDEz2YFSoRHv
