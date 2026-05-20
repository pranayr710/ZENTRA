const API_KEY = "eb55ad9eefde45c981a63901ec29e643"

export async function getCoordinates(place) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${place}&key=${API_KEY}`

  const res = await fetch(url)
  const data = await res.json()

  if (!data.results.length) {
    throw new Error("Location not found")
  }

  const { lat, lng } = data.results[0].geometry

  return { lat, lng }
}