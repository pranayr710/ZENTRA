import {
  MapContainer,
  TileLayer,
  Marker,
  useMap
} from "react-leaflet"

import { antPath } from "leaflet-ant-path"
import { useEffect } from "react"

import "leaflet/dist/leaflet.css"

// 🔥 AUTO FIT COMPONENT
function FitBounds({ segments }) {
  const map = useMap()

  useEffect(() => {

    if (!segments.length) return

    const bounds = []

    segments.forEach(seg => {
      bounds.push([seg.from.lat, seg.from.lng])
      bounds.push([seg.to.lat, seg.to.lng])
    })

    map.fitBounds(bounds, {
      padding: [50, 50]
    })

  }, [segments, map])

  return null
}

// 🔥 REAL ANIMATED PATH
function AnimatedPath({ segments }) {

  const map = useMap()

  useEffect(() => {

    if (!segments.length) return

    const paths = []

    segments.forEach(seg => {

      const path = antPath(
        [
          [seg.from.lat, seg.from.lng],
          [seg.to.lat, seg.to.lng]
        ],
        {
          delay: 400,
          dashArray: [20, 30],
          weight: 5,
          color: "#2563eb",
          pulseColor: "#1d4ed8",
          paused: false,
          reverse: false,
          hardwareAcceleration: true
        }
      )

      path.addTo(map)
      paths.push(path)
    })

    // 🔥 CLEANUP OLD PATHS
    return () => {
      paths.forEach(p => {
        try {
          map.removeLayer(p)
        } catch (err) {
          console.log(err)
        }
      })
    }

  }, [segments, map])

  return null
}

export default function CenterMap({ routes, activeRouteIndex }) {

  const route = routes?.[activeRouteIndex]
  const segments = route?.segments || []

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: "100%", width: "100%" }}
    >

      {/* 🔥 MAP TILES */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 🔥 AUTO FIT */}
      <FitBounds segments={segments} />

      {/* 🔥 REAL ANIMATION */}
      <AnimatedPath segments={segments} />

      {/* 🔥 START MARKERS */}
      {segments.map((seg, i) => (
        <Marker
          key={`from-${i}`}
          position={[seg.from.lat, seg.from.lng]}
        />
      ))}

      {/* 🔥 FINAL DESTINATION */}
      {segments.length > 0 && (
        <Marker
          position={[
            segments[segments.length - 1].to.lat,
            segments[segments.length - 1].to.lng
          ]}
        />
      )}

    </MapContainer>
  )
}