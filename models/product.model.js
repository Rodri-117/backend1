const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    code: { type: String, unique: true, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true },
    category: { type: String },
    thumbnails: [String],
}, { timestamps: true });

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', productSchema);
