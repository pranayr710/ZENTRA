import { useState, useEffect } from "react"
import LeftPanel from "./components/layout/LeftPanel"
import CenterMap from "./components/map/CenterMap"
import RightPanel from "./components/layout/RightPanel"

export default function App() {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeRoute, setActiveRoute] = useState(0)
  const [filter, setFilter] = useState("all") 

  // 🔥 ONLY ADD THIS (AUTO SELECT BEST)
  useEffect(() => {
    if (!routes.length) return

    const bestIndex = routes.findIndex(r =>
      r.type.includes("best")
    )

    if (bestIndex !== -1) {
      setActiveRoute(bestIndex)
    } else {
      setActiveRoute(0)
    }
  }, [routes])

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">

      {/* LEFT PANEL */}
      <LeftPanel onResults={setRoutes} onLoading={setLoading} />

      {/* CENTER MAP */}
      <div className="flex-1 relative">
        <CenterMap routes={routes} activeRouteIndex={activeRoute} />

        {loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-xl animate-pulse">
              🔍 Optimizing routes...
            </div>
          </div>
        )}
      </div>

      {/* RIGHT PANEL */}
      <RightPanel
        routes={routes}
        activeRoute={activeRoute}
        onSelectRoute={setActiveRoute}
        filter={filter}
        setFilter={setFilter}
      />
    </div>
  )
}