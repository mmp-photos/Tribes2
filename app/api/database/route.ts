// File: app/api/database/route.ts

import { NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://webBased:n1Rv1wLk48950ZY8@clustercore.rkcxmtz.mongodb.net/?retryWrites=true&w=majority&appName=ClusterCore";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDatabase() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");
    return client;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return null;
  }
}

export async function getData() {
    const client = await connectToDatabase();
    if (!client) {
      return NextResponse.json({ error: 'Failed to connect to MongoDB' }, { status: 500 });
    }
  
    try {
      const muppetsCollection = client.db('TribesOfMen');
      const collection = muppetsCollection.collection('users');
      const firstMuppetCursor = await collection.find({username: "Matthew M"});
      const firstMuppet = await firstMuppetCursor.toArray();
      if (firstMuppet.length === 0) {
        console.log("No user found with username: Matt");
      }
      console.log(firstMuppet);
      return NextResponse.json(firstMuppet);  // Return the results
    } catch (error) {
      console.error("Error fetching data:", error);
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    } finally {
      await client.close();
    }
}

// async function postData(data: any) {
//   const client = await connectToDatabase();
//   if (!client) {
//     return NextResponse.json({ error: 'Failed to connect to MongoDB' }, { status: 500 });
//   }

//   try {
//     const database = client.db("yourDatabaseName"); 
//     const collection = database.collection("yourCollectionName");
//     const result = await collection.insertOne(data);
//     return NextResponse.json({ message: 'Data inserted successfully', insertedId: result.insertedId });
//   } catch (error) {
//     console.error("Error inserting data:", error);
//     return NextResponse.json({ error: 'Failed to insert data' }, { status: 500 });
//   } finally {
//     await client.close();
//   }
// }

export async function GET() {
  return await getData();
}

// export async function POST(request: Request) {
//   const body = await request.json();
//   return await postData(body);
// }
