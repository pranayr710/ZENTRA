import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

export default function RouteGraph({ routes }) {

  const data = routes.map((r, i) => ({
    id: i + 1,
    cost: r.totalCost,
    duration: r.totalDuration
  }))

  return (
    <div className="h-64 bg-gray-900 rounded-xl p-4 mt-4">

      <h2 className="text-lg mb-4 text-white">
        📊 Cost vs Time Analysis
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart>

          <CartesianGrid />

          <XAxis
            type="number"
            dataKey="duration"
            name="Time"
            unit=" min"
          />

          <YAxis
            type="number"
            dataKey="cost"
            name="Cost"
            unit="$"
          />

          <Tooltip cursor={{ strokeDasharray: "3 3" }} />

          <Scatter data={data} fill="#3b82f6" />

        </ScatterChart>
      </ResponsiveContainer>

    </div>
  )
}