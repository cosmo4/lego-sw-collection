const legoSetController = {}
const { get } = require("mongoose");
const mongodb = require("../db/connect")
const ObjectId = require("mongodb").ObjectId;
const getLegoSetConnection = mongodb.getDb().db().collection('lego_set');

legoSetController.getAllSets = async function(req, res) {
    const result = await getLegoSetConnection.find();
    result.toArray().then((lists) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists);
    });
}

legoSetController.addSet = async function(req, res) {
    try {
        const newSet = req.body;
        const result = await getLegoSetConnection.insertOne(newSet);
        res.status(201).json({ id: result.insertedID})
    } catch (error) {
        console.error('Error occured while adding new lego set: ', error);
        res.status(500).json({ message: 'Internal Server Error :( '})
    }
}

module.exports = legoSetController;