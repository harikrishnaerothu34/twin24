import { MongoClient, ServerApiVersion } from "mongodb";

const uri = "mongodb+srv://erothuharikrishna2_db_user:Hari%402006@cluster0.mbhzcyd.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    await client.db("admin").command({ ping: 1 });

    console.log("✅ Successfully connected to MongoDB Atlas");

  } finally {
    await client.close();
  }
}

run().catch(console.dir);