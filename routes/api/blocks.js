const express = require('express');
const mongodb = require('mongodb');
var Blocks = require('../../models/blocks');
const router = express.Router();

router.get('/', async (req, res, next) => {
    Blocks.find({}, 'name data', function (error, blocks) {
        if (error) { console.error(error); }
        res.send({
            blocks: blocks
        })
    });
});

router.post('/', async (req, res, next) => {
    const paths = await loadPathsCollection();
    await paths.insertOne({
        type: req.body.path.type,
        title: req.body.path.title,
        description: req.body.path.description,
        name: req.body.path.name,
        data: req.body.path.data,
        created_at: new Date()
    });
    res.status(201).send();
});

router.delete('/:id', async (req, res, next) => {
    const paths = await loadPathsCollection();
    await paths.deleteOne({_id: new mongodb.ObjectID(req.params.id)});
    res.status(200).send();
});

router.patch('/:id', async (req, res, next) => {
    let paths = {
        name: req.body.name,
        title: req.body.title,
        description: req.body.description,
        data: req.body.data,
        updated_at: new Date()
    };
    Paths.findOneAndUpdate({_id: new mongodb.ObjectID(req.params.id)}, paths, { upsert: true }, function (err, path) {
        res.status(200).send();
    });
});

async function loadPathsCollection() {
    const client = await mongodb.MongoClient.connect(
        'mongodb+srv://' + process.env.DBUSER + ':' + process.env.DBPASS + '@cluster0-qxui0.mongodb.net/' + process.env.DATABASE + '?retryWrites=true',
        {useNewUrlParser: true}
    );
    return client.db('buetify').collection('paths');
}

module.exports = router;