var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PathsSchema = new Schema(
  {
    name: {type: String, required: true, max: 100},
    title: {type: String, max: 100},
    description: {type: String, max: 100},
    data: {type: Array},
    display: {type: Boolean},
    dropdown: {type: Boolean},
    searchable: {type: Boolean},
    created_at: {type: Date},
    updated_at: {type: Date},
    deleted_at: {type: Date}
  }
);

module.exports = mongoose.model('Paths', PathsSchema);
