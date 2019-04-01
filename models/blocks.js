var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BlocksSchema = new Schema(
  {
    name: {type: String, required: true, max: 100},
    data: {myJsonProperty: Object},
    created_at: {type: Date},
    updated_at: {type: Date},
    deleted_at: {type: Date}
  }
);

module.exports = mongoose.model('Blocks', BlocksSchema);