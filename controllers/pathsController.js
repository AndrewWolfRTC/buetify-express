var Paths = require('../models/paths');
var Blocks = require('../models/blocks');
function fetchBlockData (blocksRes) {
    return Blocks.find({}, 'data').
            where('name').in(blocksRes)
}
exports.index = async function(req, res, next) {
    const paths = await Paths.find({"name": req.originalUrl}, 'data')
    if (!Array.isArray(paths) || !paths.length) {
        //need to write a nice error page using bulma
        res.send({ error: 'Not found' });
        return;
    }
    var blocksRes = []; 
    var blocksHydrated = []; 
    paths[0].toObject().data.map(function (b) { 
        blocksRes.push(b);
    });
    var blocks = await fetchBlockData(blocksRes);
    var blocksHydrated = [];
    for (block in blocks) {
        blocksHydrated.push(blocks[block].data.toObject());
        if (blocksHydrated[block].blocks != null) {
            var temp = await fetchBlockData(blocks[block].data.toObject().blocks);
            //recursion goes here
            blocksHydrated[block].blocks = [];
            blocksHydrated[block].blocks.push(temp[0].data.toObject())
        }
    }
    //need to also pass site default styles that are stored dynamically
    res.render('index', { data: JSON.stringify(blocksHydrated), defaults: {}});
};
