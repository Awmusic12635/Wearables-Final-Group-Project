var express = require('express');
var list = require('../firebase/list');

var router = express.Router();

/* GET manage-devices page. */
router.get('/manage', function(req, res, next) {
    res.render('devices-manage', { title: 'Manage Devices' });
});

/* GET devices groups page. */
router.get('/groups', function(req, res, next) {
    res.render('devices-groups', { title: 'Manage Device Groups' });
});

router.get('/add', function(req, res, next) {
    var fbData = {};

    Promise.all([list('/buildings')])
        .then(function (snapshots) {
            fbData.buildings = snapshots[0];
            res.render('devices-add', fbData);
        });
});

router.

router.get('/details/:id', function(req, res, next) {
    console.log(req.param('id'));
    user = req.params.id;
    res.render('devices-details', { title: 'Manage Device Groups', user: user });
});

module.exports = router;
