import mongoose from "mongoose"

const routeSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  mode: {
    type: String,
    enum: ["flight", "train", "bus", "car"]
  },
  cost: Number,
  duration: Number
})

export default mongoose.model("Route", routeSchema)