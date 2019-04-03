const express = require('express');
const mongodb = require('mongodb');
const dotenv = require('dotenv');
var Paths = require('../../models/paths');
const router = express.Router();

router.get('/', async (req, res, next) => {
    Paths.find({ 'name' : { '$regex' : req.query.page, '$options' : 'i' } } , function (err, paths) {
        if (err) return handleError(err);
        res.status(200).send({paths: paths});
    });
});

router.post('/', async (req, res, next) => {
    Paths.create({
        type: req.body.path.type,
        title: req.body.path.title,
        description: req.body.path.description,
        display: req.body.path.display,
        dropdown: req.body.path.dropdown,
        searchable: req.body.path.searchable,
        name: req.body.path.name,
        data: req.body.path.data,
        created_at: new Date()
    }, function (err, path) {
        if (err) return handleError(err);
        res.status(200).send();
    });
});

router.delete('/:id', async (req, res, next) => {
    if (process.env.SOFTDELETES) {
        let pathUpdate = {
            deleted_at: new Date()
        };
        Paths.findOneAndUpdate({_id: new mongodb.ObjectID(req.params.id)}, pathUpdate, { upsert: true }, 
        function (err, path) {
            if (err) return handleError(err);
            res.status(200).send();
        });
    } else {
        Paths.deleteOne({_id: new mongodb.ObjectID(req.params.id)}, 
        function (err, path) {
            if (err) return handleError(err);
            res.status(200).send();
        });
    }
});

router.patch('/:id', async (req, res, next) => {
    let paths = {
        type: req.body.path.type,
        title: req.body.path.title,
        description: req.body.path.description,
        display: req.body.path.display,
        dropdown: req.body.path.dropdown,
        searchable: req.body.path.searchable,
        name: req.body.path.name,
        data: req.body.path.data,
        updated_at: new Date()
    };
    Paths.findOneAndUpdate({_id: new mongodb.ObjectID(req.params.id)}, paths, { upsert: true }, function (err, path) {
        res.status(200).send();
    });
});

module.exports = router;