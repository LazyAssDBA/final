const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');

router.route('/')
    .get(statesController.getAllStates)
    //.post()
    //.patch()
    //.delete()
    ;

router.route('/:id')
    .get(statesController.getState)

router.route('/:id/capital')
    .get(statesController.getCapital)

    router.route('/:id/nickname')
    .get(statesController.getNickname)

    router.route('/:id/population')
    .get(statesController.getPopulation)

    router.route('/:id/admission')
    .get(statesController.getAdmission)

module.exports = router;