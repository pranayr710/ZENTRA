import City from "../models/City.model.js"
import { findBalancedPaths } from "../services/path.service.js"

// 🔥 helper to convert edges → segments
async function convertToSegments(edges) {  
  const segments = [] 

  for (let edge of edges) {
    const fromC = await City.findOne({ code: edge.from })
    const toC = await City.findOne({ code: edge.to })

    segments.push({
      mode: edge.mode, 
      from: {
        name: fromC.name,
        lat: fromC.coordinates.lat,
        lng: fromC.coordinates.lng
      },
      to: {
        name: toC.name,
        lat: toC.coordinates.lat,
        lng: toC.coordinates.lng
      },
      cost: edge.cost,
      duration: edge.duration,
      airline: edge.airline || "Unknown Airline",
      departureTime: edge.departureTime || null,
      arrivalTime: edge.arrivalTime || null,
    })
  }

  return segments
}

export const searchRoutes = async (req, res) => {
  const { from, to } = req.body

  try {
    // 1. Find cities
    const fromCity = await City.findOne({
      name: { $regex: from, $options: "i" }
    })

    const toCity = await City.findOne({
      name: { $regex: to, $options: "i" }
    })

    if (!fromCity || !toCity) {
      return res.status(404).json({ error: "City not found" })
    }

    const results = []

    // 🔥 STEP 1: GET ALL PATHS
    const allPaths = await findBalancedPaths(fromCity.code, toCity.code)

    if (!allPaths.length) {
      return res.json({ paths: [] })
    }

    // 🔥 STEP 2: FIND BEST ROUTES
    const cheapest = [...allPaths].sort((a, b) => a.totalCost - b.totalCost)[0]
    const fastest = [...allPaths].sort((a, b) => a.totalDuration - b.totalDuration)[0]
    const balancedTop = [...allPaths].slice(0, 3)

    // ⭐ NEW: BEST ROUTE (cost + weighted time)
    const best = [...allPaths].sort(
      (a, b) =>
        (a.totalCost + a.totalDuration * 0.5) -
        (b.totalCost + b.totalDuration * 0.5)
    )[0]

    // 🔥 STEP 3: ADD ROUTES (MULTI-TYPE SUPPORT)
    for (let p of allPaths) {

      const segments = await convertToSegments(p.edges)

      const types = ["all"]

      if (p === cheapest) types.push("cost")
      if (p === fastest) types.push("time")
      if (balancedTop.includes(p)) types.push("balanced")
      if (p === best) types.push("best")   // ⭐ NEW

      results.push({
        type: types,
        totalCost: p.totalCost,
        totalDuration: p.totalDuration,
        segments
      })
    }

    res.json({
      paths: results
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
}
