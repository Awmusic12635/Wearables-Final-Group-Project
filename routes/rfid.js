var express = require('express');
var router = express.Router();

/* GET manage-devices page. */
router.get('/manage', function(req, res, next) {
    res.render('rfid-manage', { title: 'Manage RFID Access' });
});

/* GET devices groups page. */
router.get('/failed', function(req, res, next) {
    res.render('rfid-failed-attempts', { title: 'Failed Attempts' });
});

module.exports = router;
