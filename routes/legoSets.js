const express = require('express');
const router = express.Router();
const legoSetController = require('../controllers/legoSetController');
// add these later: updateSet, deleteSet, getSetById

router.get('/', legoSetController.getAllSets);
// router.get('/:setNumber', getSetById);
router.post('/', legoSetController.addSet);
// router.put('/:setNumber', updateSet);
// router.delete('/:setNumber', deleteSet);

module.exports = router;