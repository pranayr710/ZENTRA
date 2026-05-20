import mongoose from "mongoose"

const citySchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  country: { type: String, required: true },
  coordinates: {
    lat: Number,
    lng: Number
  }
})

export default mongoose.model("City", citySchema)