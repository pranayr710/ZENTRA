export function normalizeFlights(flights) {

  return flights.map(f => {

    const dep = new Date(f.departure.scheduled)
    const arr = new Date(f.arrival.scheduled) 

    // duration in minutes 
    const duration =
      Math.max(
        60,
        Math.floor((arr - dep) / 1000 / 60)
      )

    // simulated smart pricing
    const cost =
      Math.floor(duration * 0.8) +
      Math.floor(Math.random() * 200)

    return {
  from: f.departure.iata,
  to: f.arrival.iata,

  airline: f.airline?.name || "Unknown",

  departureTime:
    f.departure?.scheduled || null,

  arrivalTime:
    f.arrival?.scheduled || null,

  duration,
  cost,

  mode: "flight"
}
  })
}
