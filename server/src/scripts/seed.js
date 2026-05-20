import mongoose from "mongoose"
import dotenv from "dotenv"
import City from "../models/City.model.js"
import Route from "../models/Route.model.js"
 
dotenv.config()

await mongoose.connect(process.env.MONGODB_URI)
console.log("Connected to MongoDB")

// sample cities
const cities = [
  { code: "DOH", name: "Doha", country: "Qatar", coordinates: { lat: 25.276987, lng: 51.520008 } },
  { code: "DXB", name: "Dubai", country: "UAE", coordinates: { lat: 25.276987, lng: 55.296249 } },
  { code: "BOM", name: "Mumbai", country: "India", coordinates: { lat: 19.0760, lng: 72.8777 } },
  { code: "LON", name: "London", country: "UK", coordinates: { lat: 51.5074, lng: -0.1278 } }
]

// sample routes
const routes = [
  { from: "DOH", to: "DXB", mode: "flight", cost: 300, duration: 120 },
  { from: "DXB", to: "BOM", mode: "flight", cost: 250, duration: 180 },
  { from: "BOM", to: "LON", mode: "flight", cost: 400, duration: 540 }
]

await City.deleteMany({})
await Route.deleteMany({})

await City.insertMany(cities)
await Route.insertMany(routes)

console.log("Data seeded successfully")
process.exit()