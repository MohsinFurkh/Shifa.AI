import { MongoClient } from 'mongodb';

// Note: Make sure to add this URI to Vercel environment variables
// for security in the production environment.
// For local development, you might want to use a .env file.
const uri = "mongodb+srv://shifadotai:Shireen2024@shifaaicluster.8sou1eg.mongodb.net/?retryWrites=true&w=majority&appName=ShifaAICluster";
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise; 