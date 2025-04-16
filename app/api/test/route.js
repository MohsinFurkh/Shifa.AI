import { MongoClient } from 'mongodb';

export async function GET() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    
    // Test the connection by listing collections
    const collections = await db.listCollections().toArray();
    
    await client.close();
    
    return Response.json({
      success: true,
      message: 'MongoDB connection successful',
      collections: collections.map(col => col.name)
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: 'MongoDB connection failed',
      error: error.message
    }, { status: 500 });
  }
} 