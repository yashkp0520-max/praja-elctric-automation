const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: Number,
  category: {
    type: String,
    enum: ['panels', 'plc', 'sensors', 'drives', 'components'],
    required: true
  },
  images: [String],
  specifications: [{ key: String, value: String }],
  stock: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Product', ProductSchema);
