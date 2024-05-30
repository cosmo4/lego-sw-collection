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

legoSetController.updateSet = async function(req, res) {
    try {
        const setId = new ObjectId(req.params.setId);
        const updateData = req.body;
        const result = await getLegoSetConnection.updateOne({ _id: setId}, { $set: updateData})
        res.sendStatus(204);
    } catch (error) {
        console.error('Error occured while trying to update the set: ', error);
        res.status(500);
    }
}

legoSetController.deleteSet = async function(req, res) {
    try {
        const setId = new ObjectId(req.params.setId);
        const result = await getLegoSetConnection.deleteOne({ _id: setId });
        res.sendStatus(200);
    } catch (error) {
        console.error('Error occurred while deleting contact: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = legoSetController;