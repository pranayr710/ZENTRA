import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

const API_KEY = process.env.AVIATIONSTACK_API_KEY
 
export async function searchFlights(from, to) {

  try {

    const response = await axios.get(
      "http://api.aviationstack.com/v1/flights",
      {
        params: {
          access_key: API_KEY,
          dep_iata: from,
          arr_iata: to
        }
      }
    )

    return response.data.data || []

  } catch (err) {

    console.error("AVIATIONSTACK ERROR:", err.message)
    return []
  }
}
