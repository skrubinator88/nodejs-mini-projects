var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  text: String
});

module.exports = mongoose.model('Todo', schema);
