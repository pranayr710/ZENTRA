import mongoose from "mongoose"

export let isDbConnected = false

const mockCities = [
  { code: "DOH", name: "Doha", country: "Qatar", coordinates: { lat: 25.276987, lng: 51.520008 } },
  { code: "DXB", name: "Dubai", country: "UAE", coordinates: { lat: 25.276987, lng: 55.296249 } },
  { code: "BOM", name: "Mumbai", country: "India", coordinates: { lat: 19.0760, lng: 72.8777 } },
  { code: "LON", name: "London", country: "UK", coordinates: { lat: 51.5074, lng: -0.1278 } },
  { code: "NYC", name: "New York", country: "USA", coordinates: { lat: 40.7128, lng: -74.0060 } },
  { code: "PAR", name: "Paris", country: "France", coordinates: { lat: 48.8566, lng: 2.3522 } },
  { code: "SIN", name: "Singapore", country: "Singapore", coordinates: { lat: 1.3521, lng: 103.8198 } },
  { code: "TYO", name: "Tokyo", country: "Japan", coordinates: { lat: 35.6762, lng: 139.6503 } }
]

const mockRoutes = [
  { from: "DOH", to: "DXB", mode: "flight", cost: 300, duration: 120 },
  { from: "DXB", to: "BOM", mode: "flight", cost: 250, duration: 180 },
  { from: "BOM", to: "LON", mode: "flight", cost: 400, duration: 540 },
  { from: "LON", to: "NYC", mode: "flight", cost: 350, duration: 480 },
  { from: "NYC", to: "PAR", mode: "flight", cost: 400, duration: 450 },
  { from: "PAR", to: "DOH", mode: "flight", cost: 500, duration: 360 },
  { from: "SIN", to: "BOM", mode: "flight", cost: 200, duration: 300 },
  { from: "TYO", to: "SIN", mode: "flight", cost: 300, duration: 420 },
  { from: "BOM", to: "TYO", mode: "flight", cost: 450, duration: 510 }
]

// Hook mongoose Model methods to fallback to mock data when database connection is not active
const originalFind = mongoose.Model.find
mongoose.Model.find = function(...args) {
  if (!isDbConnected) {
    if (this.modelName === 'Route') {
      return Promise.resolve(mockRoutes)
    }
    if (this.modelName === 'City') {
      return Promise.resolve(mockCities)
    }
  }
  return originalFind.apply(this, args)
}

const originalFindOne = mongoose.Model.findOne
mongoose.Model.findOne = function(query, ...args) {
  if (!isDbConnected) {
    if (this.modelName === 'City') {
      if (query && query.code) {
        const city = mockCities.find(c => c.code === query.code)
        return Promise.resolve(city || null)
      }
      if (query && query.name && query.name.$regex) {
        const pattern = new RegExp(query.name.$regex, query.name.$options || 'i')
        const city = mockCities.find(c => pattern.test(c.name))
        return Promise.resolve(city || null)
      }
    }
    if (this.modelName === 'Route') {
      const route = mockRoutes.find(r => {
        return (!query || !query.from || r.from === query.from) && (!query || !query.to || r.to === query.to)
      })
      return Promise.resolve(route || null)
    }
  }
  return originalFindOne.apply(this, query ? [query, ...args] : args)
}

export async function connectDB() {
  try {
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes("your_mongodb_url")) {
      throw new Error("Invalid or default MONGODB_URI configured")
    }
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("✅ MongoDB connected")
    isDbConnected = true
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message)
    console.log("⚠️ Running in mock in-memory database mode for local testing.")
    isDbConnected = false
  }
}