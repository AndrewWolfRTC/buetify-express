const express = require('express');
const mongodb = require('mongodb');
var Blocks = require('../../models/blocks');
const router = express.Router();

router.get('/', async (req, res, next) => {
    if (typeof req.query.blocks == 'undefined') {
        req.query.blocks = '';
    }
    Blocks.find({ 'name' : { '$regex' : req.query.blocks, '$options' : 'i' } }, function (error, blocks) {
        if (error) { console.error(error); }
        res.send({
            blocks: blocks
        })
    });
});

router.post('/', async (req, res, next) => {
    req.body.block.type = req.body.block.block.type;
    delete req.body.block.block;
    Blocks.create({ 
        name: req.body.block.name,
        data: JSON.stringify(req.body.block),
        created_at: new Date()
    }, function (err, block) {
        if (err) return handleError(err);
        res.status(201).send();
    });
});

router.delete('/:id', async (req, res, next) => {
    if (process.env.SOFTDELETES) {
        let blockUpdate = {
            deleted_at: new Date()
        };
        Blocks.findOneAndUpdate({_id: new mongodb.ObjectID(req.params.id)}, blockUpdate, { upsert: true }, 
        function (err, path) {
            if (err) return handleError(err);
            res.status(200).send();
        });
    } else {
        Blocks.deleteOne({_id: new mongodb.ObjectID(req.params.id)}, 
        function (err, block) {
            if (err) return handleError(err);
            res.status(200).send();
        });
    }
});

router.patch('/:id', async (req, res, next) => {
    let blocks = {
        name: req.body.name,
        data: req.body.data,
        updated_at: new Date()
    };
    Blocks.findOneAndUpdate({_id: new mongodb.ObjectID(req.params.id)}, blocks, { upsert: true }, function (err, block) {
        res.status(200).send();
    });
});

module.exports = router;