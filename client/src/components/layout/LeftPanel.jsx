import { useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"

const API = import.meta.env.VITE_API_URL

export default function LeftPanel({ onResults, onLoading }) {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [error, setError] = useState("")  

  async function handleSearch(e) {
    e.preventDefault()

    if (!from || !to) {
      setError("Enter both cities")
      return
    }

    setError("")
    onLoading(true)

    try {
      const res = await axios.post(`${API}/api/search`, {
  from,
  to
})

console.log("🔥 FULL RESPONSE:", res.data)

onResults(res.data.paths || [])

    } catch (err) {
      console.error(err)
      const msg = err.response?.data?.error || "API request failed"
      setError(msg)
    } finally {
      onLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ x: -200 }}
      animate={{ x: 0 }}
      className="w-80 bg-gray-900 border-r border-gray-800 p-6"
    >
      <h1 className="text-2xl font-bold text-blue-400 mb-4">ZENTRA</h1>

      <form onSubmit={handleSearch} className="flex flex-col gap-3">

        <input
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="From (e.g. Doha)"
          className="bg-gray-800 p-2 rounded"
        />

        <input
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="To (e.g. London)"
          className="bg-gray-800 p-2 rounded"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button className="bg-blue-600 p-2 rounded hover:bg-blue-500">
          Search Routes
        </button>

      </form>
    </motion.div>
  )
}
