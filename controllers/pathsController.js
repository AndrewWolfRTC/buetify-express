var Paths = require('../models/paths');
var Blocks = require('../models/blocks');
function fetchPageData (blocksRes) {
    return Blocks.find({}, 'data').where('name').in(blocksRes)
}

async function fetchBlockData (blocksRes) {
    var result = await Blocks.find({}, 'data').where('name').in(blocksRes)
    var blocks = result.map(function (c) {
        var data = JSON.parse(c.data.toObject());
        //recursion if needed
        return data;
    });
    return blocks;
}


exports.index = async function(req, res, next) {
    const paths = await Paths.find({"name": req.originalUrl}, 'data title description')
    if (!Array.isArray(paths) || !paths.length) {
        //need to write a nice error page
        res.send({ error: 'Not found' });
        return;
    }
    var blocksRes = []; 
    var pathsConversion = paths[0].toObject();
    pathsConversion.data.map(function (b) { 
        blocksRes.push(b);
    });
    //get the block data from the page object
    var blocks = await fetchPageData(blocksRes);

    let convertedBlocks = blocks.map(function (c) {
        return JSON.parse(c.data.toObject());;
    });

    for (block in convertedBlocks) {
        if (typeof convertedBlocks[block].data != 'undefined') {
            convertedBlocks[block].data = await fetchBlockData(convertedBlocks[block].data);
        } else {
            convertedBlocks[block] = convertedBlocks[block];
        }
    }

    res.render('index', {data: JSON.stringify(convertedBlocks), title: process.env.APPNAME + ' - ' + pathsConversion.title, description: pathsConversion.description});
};
