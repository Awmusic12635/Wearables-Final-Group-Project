var express = require('express');
var list = require('../firebase/list');
var create = require('../firebase/create');

var router = express.Router();

/* GET devices groups page. */
router.get('/groups', function(req, res, next) {
    res.render('devices-groups', { title: 'Manage Device Groups' });
});

router.get('/add', function(req, res, next) {
    var fbData = {};

    Promise.all([list('/buildings')])
        .then(function (snapshots) {
            fbData.buildings = snapshots[0];
            fbData.title = 'Add Devices';
            res.render('devices-add', fbData);
        });
});

// form validation
router.post('/add', function (req, res, next) {
    req.checkBody('name', 'Device Name required').notEmpty();
    req.checkBody('type', 'Device Type required').notEmpty();

    req.sanitize('name').escape();
    req.sanitize('name').trim();
    req.sanitize('type').escape();
    req.sanitize('type').trim();

    var errors = req.validationErrors();
    console.log(errors);

    if (errors) {
        var data =  {title: 'Add Devices', errors: errors };
        Promise.all([list('/buildings')])
            .then(function (snapshots) {
                data.buildings = snapshots[0];
                res.render('devices-add', data);
            });
    } else {
        var device = {
            name: req.body.name,
            type: req.boy.type,
            building: {
                name: req.body.buildingName,
                room: req.body.room
            }
        };

        create('/devices', device).then(next())
    }
});

/* GET manage-devices page. */
router.get('/manage', function(req, res, next) {
    var data = [];

    Promise.all([list('/devices')])
        .then(function (snapshots) {
            data.devices = snapshots[0];
            data.title = 'Manage Devices';
            res.render('devices-manage', data);
        });
});

router.get('/details/:id', function(req, res, next) {
    user = req.params.id;
    res.render('devices-details', { title: 'Manage Device Groups', user: user });
});

module.exports = router;
