var express = require('express');
var router = express.Router();
var list = require('../firebase/list');

router.get('/add', function(req, res, next) {
    res.render('rfid-users-add', {title: 'Add RFID Access'});
});

// form validation
router.post('/add', function (req, res, next) {

});


/* GET manage-devices page. */
router.get('/manage', function(req, res, next) {
    var data = {};

    Promise.all([list('/users')])
        .then(function (snapshots) {
            data.users = snapshots[0];
            data.title = 'Manage Users / RFID Cards';
            res.render('rfid-manage', data);
        });
});

/* GET devices groups page. */
router.get('/failed', function(req, res, next) {
    res.render('rfid-failed-attempts', { title: 'Failed Attempts' });
});

module.exports = router;
