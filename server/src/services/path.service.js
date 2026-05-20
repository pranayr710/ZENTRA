import Route from "../models/Route.model.js"
import { searchFlights } from "./aviation.service.js"
import { normalizeFlights } from "./flightNormalizer.service.js"

// 🔥 BEST PATH (Cheapest / Fastest)
export async function findBestPath(start, end, mode = "cost") {

  // 🔥 DATABASE ROUTES
  const routes = await Route.find()

  // 🔥 LIVE API ROUTES
  const liveFlights = await searchFlights(start, end)
  const normalizedFlights = normalizeFlights(liveFlights)

  console.log("LIVE FLIGHTS:", liveFlights)
console.log("NORMALIZED:", normalizedFlights)
  // 🔥 HYBRID GRAPH
  const allRoutes = [
    ...routes,
    ...normalizedFlights
  ]

  // 🔥 BUILD ADJACENCY LIST
  const graph = {}

  allRoutes.forEach(r => {

    if (!graph[r.from]) {
      graph[r.from] = []
    }

    graph[r.from].push(r)
  })

  // 🔥 PRIORITY QUEUE STYLE BFS
  const queue = [{
    node: start,
    path: [],
    totalCost: 0,
    totalDuration: 0
  }]

  const visited = new Set()

  while (queue.length > 0) {

    // 🔥 SORT BASED ON MODE
    queue.sort((a, b) => {

      if (mode === "cost") {
        return a.totalCost - b.totalCost
      }

      if (mode === "time") {
        return a.totalDuration - b.totalDuration
      }

      // ⚖️ BALANCED
      return (
        (a.totalCost * 0.6 + a.totalDuration * 0.4) -
        (b.totalCost * 0.6 + b.totalDuration * 0.4)
      )
    })

    const current = queue.shift()

    if (!current) break

    // 🔥 DESTINATION FOUND
    if (current.node === end) {

      console.log("✅ FINAL PATH:", current.path)

      return current.path
    }

    if (visited.has(current.node)) continue

    visited.add(current.node)

    // 🔥 EXPLORE NEIGHBORS
    for (let route of graph[current.node] || []) {

      queue.push({
        node: route.to,

        path: [
          ...current.path,
          {
            from: route.from,
            to: route.to,
            cost: route.cost,
            duration: route.duration,
            mode: route.mode,
            airline: route.airline || null,
            departureTime: route.departureTime || null,
            arrivalTime: route.arrivalTime || null,
          }
        ],

        totalCost:
          current.totalCost + route.cost,

        totalDuration:
          current.totalDuration + route.duration
      })
    }
  }

  console.log("❌ NO PATH FOUND")

  return []
}

// 🔥 FIND ALL BALANCED PATHS
export async function findBalancedPaths(start, end) {

  // 🔥 DATABASE ROUTES
  const routes = await Route.find()

  // 🔥 LIVE API ROUTES
  const liveFlights = await searchFlights(start, end)
  const normalizedFlights = normalizeFlights(liveFlights)

  // 🔥 HYBRID GRAPH
  const allRoutes = [
    ...routes,
    ...normalizedFlights
  ]

  // 🔥 BUILD GRAPH
  const graph = {}

  allRoutes.forEach(r => {

    if (!graph[r.from]) {
      graph[r.from] = []
    }

    graph[r.from].push(r)
  })

  const allPaths = []

  // 🔥 DFS SEARCH
  function dfs(
    current,
    path,
    visited,
    totalCost,
    totalDuration
  ) {

    // ✅ DESTINATION FOUND
    if (current === end) {

      allPaths.push({
        edges: [...path],
        totalCost,
        totalDuration,
        score:
          totalCost * 0.6 +
          totalDuration * 0.4
      })

      return
    }

    for (let r of graph[current] || []) {

      // 🔥 PREVENT LOOPS
      if (!visited.has(r.to)) {

        path.push({
  from: r.from,
  to: r.to,
  cost: r.cost,
  duration: r.duration,
  mode: r.mode,

  airline: r.airline || "Unknown Airline",

  departureTime:
    r.departureTime || null,

  arrivalTime:
    r.arrivalTime || null,
})

        visited.add(r.to)

        dfs(
          r.to,
          path,
          visited,
          totalCost + r.cost,
          totalDuration + r.duration
        )

        path.pop()
        visited.delete(r.to)
      }
    }
  }

  dfs(
    start,
    [],
    new Set([start]),
    0,
    0
  )

  console.log("🔥 ALL PATHS FOUND:", allPaths)

  // 🔥 SORT BEST FIRST
  allPaths.sort((a, b) => a.score - b.score)

  return allPaths
}