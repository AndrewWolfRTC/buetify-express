const express = require('express');
const mongodb = require('mongodb');
const router = express.Router();

/* GET paths. */
router.get('/', async (req, res, next) => {
    const paths = await loadPathsCollection();
    res.send(await paths.find({}).toArray());
});

/* POST new path. */
router.post('/', async (req, res, next) => {
    const paths = await loadPathsCollection();
    await paths.insertOne({
        slug: req.body.text,
        created_at: new Date()
    });
    res.status(201).send();
});

async function loadPathsCollection() {
    const client = await mongodb.MongoClient.connect(
        'mongodb+srv://mattanderson:test123@cluster0-qxui0.mongodb.net/buetify?retryWrites=true',
        {useNewUrlParser: true}
    );
    return client.db('buetify').collection('paths');
}

module.exports = router;