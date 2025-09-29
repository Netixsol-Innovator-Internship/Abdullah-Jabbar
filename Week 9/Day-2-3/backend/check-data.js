const { MongoClient } = require("mongodb");
async function checkData() {
  const client = new MongoClient("mongodb://localhost:27017");
  await client.connect();
  const db = client.db("cricket");
  
  console.log("=== All Collections ===");
  const collections = await db.listCollections().toArray();
  console.log("Collections:", collections.map(c => c.name));
  
  console.log("\n=== Test Matches Sample ===");
  const testMatches = await db.collection("testmatches").find().limit(3).toArray();
  console.log("Sample testmatches:", JSON.stringify(testMatches, null, 2));
  
  console.log("\n=== England vs Australia in 1972 ===");
  const engAus1972 = await db.collection("testmatches").find({
    team: "England",
    opposition: "Australia", 
    start_date: { $gte: new Date("1972-08-01"), $lte: new Date("1972-08-31") }
  }).toArray();
  console.log("Found:", engAus1972.length, "matches");
  if (engAus1972.length > 0) console.log(JSON.stringify(engAus1972, null, 2));
  
  await client.close();
}
checkData().catch(console.error);
