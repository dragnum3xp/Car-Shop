const express = require('express');
const router = express.Router();

const carsController = require('../controllers/cars');
const validation = require('../middleware/validate');
const { isAuthenticated } = require("../middleware/authenticate");

router.get('/', carsController.getAll);
router.get('/:id', carsController.getSingle);
router.post('/', isAuthenticated, validation.saveCar, carsController.createCar);
router.put('/:id', isAuthenticated, validation.saveCar, carsController.updateCar);
router.delete('/:id', isAuthenticated, carsController.deleteCar);

module.exports = router;

