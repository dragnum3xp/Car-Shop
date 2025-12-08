const express = require('express');
const router = express.Router();

const usersController = require('../controllers/stores');
const validation = require('../middleware/validate');
const { isAuthenticated } = require("../middleware/authenticate");

router.get('/', usersController.getAll);
router.get('/:id', usersController.getSingle);
router.post('/', isAuthenticated, validation.saveStore, usersController.createStore);
router.put('/:id', isAuthenticated, validation.saveStore, usersController.updateStore);
router.delete('/:id', isAuthenticated, usersController.deleteStore);

module.exports = router;