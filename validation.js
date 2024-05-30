const { check, param } = require("express-validator");
const mongodb = require("./db/connect")
const ObjectId = require("mongodb").ObjectId;
const getLegoSetConnection = mongodb.getDb().db().collection('lego_set');

const validator = {};
validator.signupValidation = [
  check("name", "Name is requied").not().isEmpty(),
  check("email", "Please include a valid email")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("password", "Password must be 6 or more characters").isLength({
    min: 6,
  }),
];

validator.loginValidation = [
  check("email", "Please include a valid email")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("password", "Password must be 6 or more characters").isLength({
    min: 6,
  }),
];

validator.createValidation = [
  // Validate setNumber: should be an integer between 1000 and 99999
    check("setNumber")
    .isLength({ min: 4, max: 5 })
    .withMessage('setNumber should be 4 to 5 characters long')
    .matches(/^\d+$/)
    .withMessage('setNumber should contain only numbers'),

  // Validate name: should be a string of at least 3 characters in length
  check("name")
    .isString()
    .isLength({ min: 3 })
    .withMessage("name should be at least 3 characters long"),

  // Validate pieceCount: should be an integer greater than 1
  check("pieceCount")
    .isInt({ min: 2 })
    .withMessage("pieceCount should be an integer greater than 1"),

  // Validate price: should be a float with only 2 digits after the decimal
  check("price")
    .isFloat({ min: 0 })
    .custom((value) => {
      if (!/^\d+(\.\d{1,2})?$/.test(value)) {
        throw new Error("price should have only 2 digits after the decimal");
      }
      return true;
    }),

  // Validate characters: should be an array of strings with the first letter capitalized
  check("characters")
    .isArray()
    .withMessage("characters should be an array")
    .custom((value) => {
      if (
        !value.every((str) => typeof str === "string" && /^[A-Z]/.test(str))
      ) {
        throw new Error(
          "Each character should be a string with the first letter capitalized"
        );
      }
      return true;
    }),

  // Validate built: should be a boolean (true or false)
  check("built").isBoolean().withMessage("built should be a boolean"),

  // Validate purchaseDate: should be a string formatted like a date (mm-dd-yyyy)
  check("purchaseDate")
    .matches(/^(0[1-9]|1[0-2])-([0-2][0-9]|3[01])-\d{4}$/)
    .withMessage("purchaseDate should be in the format mm-dd-yyyy"),
];

validator.updateValidation = [
    param('setId')
    .isMongoId()
    .withMessage('Invalid setId format')
    .custom(async (value) => {
        const setExists = await getLegoSetConnection.findOne( { _id: new ObjectId(value) });
        if (!setExists) {
            throw new Error('setId does not exist');
        }
    }),
    check("setNumber").optional()
    .isLength({ min: 4, max: 5 })
    .withMessage('setNumber should be 4 to 5 characters long')
    .matches(/^\d+$/)
    .withMessage('setNumber should contain only numbers'),

  // Validate name: should be a string of at least 3 characters in length
  check("name").optional()
    .isString()
    .isLength({ min: 3 })
    .withMessage("name should be at least 3 characters long"),

  // Validate pieceCount: should be an integer greater than 1
  check("pieceCount").optional()
    .isInt({ min: 2 })
    .withMessage("pieceCount should be an integer greater than 1"),

  // Validate price: should be a float with only 2 digits after the decimal
  check("price").optional()
    .isFloat({ min: 0 })
    .custom((value) => {
      if (!/^\d+(\.\d{1,2})?$/.test(value)) {
        throw new Error("price should have only 2 digits after the decimal");
      }
      return true;
    }),

  // Validate characters: should be an array of strings with the first letter capitalized
  check("characters").optional()
    .isArray()
    .withMessage("characters should be an array")
    .custom((value) => {
      if (
        !value.every((str) => typeof str === "string" && /^[A-Z]/.test(str))
      ) {
        throw new Error(
          "Each character should be a string with the first letter capitalized"
        );
      }
      return true;
    }),

  // Validate built: should be a boolean (true or false)
  check("built").optional().isBoolean().withMessage("built should be a boolean"),

  // Validate purchaseDate: should be a string formatted like a date (mm-dd-yyyy)
  check("purchaseDate").optional()
    .matches(/^(0[1-9]|1[0-2])-([0-2][0-9]|3[01])-\d{4}$/)
    .withMessage("purchaseDate should be in the format mm-dd-yyyy"),
]

validator.deleteValidation = [
    param('setId')
    .isMongoId()
    .withMessage('Invalid setId format')
    .custom(async (value) => {
        const setExists = await getLegoSetConnection.findOne( { _id: new ObjectId(value) });
        if (!setExists) {
            throw new Error('setId does not exist');
        }
    })
]

module.exports = validator;
