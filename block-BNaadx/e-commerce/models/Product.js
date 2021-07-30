var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  like: {type: Number, default: 0}
});

module.exports = mongoose.model('Product', productSchema)
