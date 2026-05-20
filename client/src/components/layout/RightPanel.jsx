import RouteGraph from "../charts/RouteGraph"

export default function RightPanel({
  routes,
  activeRoute,
  onSelectRoute,
  filter,
  setFilter
}) { 

  // 🔥 FILTERED ROUTES
  const filteredRoutes =
    filter === "all"
      ? routes
      : routes.filter(r => r.type.includes(filter))

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-800 p-4 overflow-y-auto">

      <h2 className="mb-4 text-lg">
        {routes.length > 0 ? "Routes Found" : "No routes yet"}
      </h2>

      {/* 🔥 FILTER BUTTONS */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", "cost", "time", "balanced"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2 py-1 rounded text-sm transition-all ${
              filter === f
                ? "bg-blue-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {f === "all"
              ? "All"
              : f === "cost"
              ? "💰 Cheapest"
              : f === "time"
              ? "⚡ Fastest"
              : "⚖️ Balanced"}
          </button>
        ))}
      </div>

      {/* 🔥 ROUTE CARDS */}
      {filteredRoutes.map((route, i) => {

        const realIndex = routes.findIndex(r => r === route)

        return (
          <div
            key={i}
            onClick={() => onSelectRoute(realIndex)}
            className={`p-4 mb-3 rounded cursor-pointer transition-all duration-300
              ${
                activeRoute === realIndex
                  ? "bg-blue-900/30 border border-blue-500 scale-[1.02]"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
          >

            {/* 🔥 BADGES */}
            <div className="flex gap-2 mb-2 flex-wrap">

              {route.type.includes("best") && (
                <span className="bg-purple-600 px-2 py-0.5 text-xs rounded">
                  ⭐ Best
                </span>
              )}

              {route.type.includes("cost") && (
                <span className="bg-green-600 px-2 py-0.5 text-xs rounded">
                  💰 Cheapest
                </span>
              )}

              {route.type.includes("time") && (
                <span className="bg-yellow-600 px-2 py-0.5 text-xs rounded text-black">
                  ⚡ Fastest
                </span>
              )}

              {route.type.includes("balanced") && (
                <span className="bg-blue-600 px-2 py-0.5 text-xs rounded">
                  ⚖️ Balanced
                </span>
              )}

            </div>

            {/* 🔥 PRICE + TIME */}
            <div className="flex justify-between items-center mb-2">
              <p className="text-green-400 font-bold text-lg">
                ${route.totalCost}
              </p>

              <p className="text-sm text-gray-400">
                {route.totalDuration} mins
              </p>
            </div>

            {/* 🔥 SEGMENTS */}
            <div className="text-xs text-gray-300 space-y-1">

              {route.segments?.map((seg, idx) => {

                const icon =
                  seg.mode === "flight"
                    ? "✈️"
                    : seg.mode === "train"
                    ? "🚆"
                    : seg.mode === "bus"
                    ? "🚌"
                    : "🚗"

                return (
                  <div
                    key={idx}
                    className="flex justify-between items-center"
                  >
                    <div className="flex flex-col">
  <span>
    {icon} {seg.from.name} → {seg.to.name}
  </span>

  <div className="flex flex-col">

  <span className="text-blue-400 text-[10px]">
    {seg.airline}
  </span>

  {seg.departureTime && (
    <span className="text-gray-400 text-[10px]">

      {new Date(seg.departureTime)
        .toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })}

      {" → "}

      {new Date(seg.arrivalTime)
        .toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })}

    </span>
  )}

</div>
</div>

                    <span className="text-green-400">
                      ${seg.cost}
                    </span>
                  </div>
                )
              })}

            </div>

          </div>
        )
      })}

      {/* 🔥 GRAPH SECTION */}
      {routes.length > 0 && (
        <RouteGraph routes={routes} />
      )}

    </div>
  )
}
