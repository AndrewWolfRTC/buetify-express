var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BlocksSchema = new Schema(
  {
    slug: {type: String, required: true, max: 100},
    data: {myJsonProperty: Object},
    searchable: {type: Boolean},
    global: {type: Boolean},
    created_at: {type: Date},
    updated_at: {type: Date},
    deleted_at: {type: Date}
  }
);

module.exports = mongoose.model('Blocks', BlocksSchema);