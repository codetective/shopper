const mongoose = require('mongoose')

const stockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  qty: {
    type: Number,
    require: true,
  }
})

module.exports = mongoose.model("stock", stockSchema);