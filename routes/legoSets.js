const express = require('express');
const router = express.Router();
const legoSetController = require('../controllers/legoSetController');
const { signupValidation, loginValidation, createValidation, updateValidation, deleteValidation } = require('../validation');
const errorHandler = require('../middlewares/validationErrorHandler')
// add these later: updateSet, deleteSet, getSetById

router.get('/', legoSetController.getAllSets);
// router.get('/:setNumber', getSetById);
router.post('/', createValidation, errorHandler, legoSetController.addSet);
router.put('/:setId', updateValidation, errorHandler, legoSetController.updateSet);
router.delete('/:setId', deleteValidation, errorHandler, legoSetController.deleteSet);

module.exports = router;