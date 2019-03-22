var express = require('express');
var router = express.Router();

var paths_controller = require('../controllers/pathsController');

router.get('/*', paths_controller.index);

module.exports = router;
