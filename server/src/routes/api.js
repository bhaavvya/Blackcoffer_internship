const express = require('express');
const router = express.Router();
const {getData} = require('../controllers/dataController.js');


router.get('/data', getData);
// router.post('/data', dataController.addData);

module.exports = router;