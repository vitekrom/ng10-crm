const express = require('express');
const passport = require('passport');
const controller = require('../controllers/analytics.js');
const router = express.Router();

router.get(
    '/analytics',
    passport.authenticate('jwt', { session: false }),
    controller.analytics
);
router.get(
    '/overview',
    passport.authenticate('jwt', { session: false }),
    controller.owerview
);

module.exports = router;
