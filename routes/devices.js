var express = require('express');
var list = require('../firebase/list');
var createWithId = require('../firebase/create-id');
var get = require('../firebase/get');
var remove = require('../firebase/delete');

var router = express.Router();
var firebase = require('firebase');
var db = firebase.database();

/* GET devices groups page. */
router.get('/groups', function(req, res, next) {
    res.render('devices-groups', { title: 'Manage Device Groups' });
});

router.get('/add', function(req, res, next) {
    var data = {};

    Promise.all([list('/buildings'), list('/groups')])
        .then(function (snapshots) {
            data.buildings = snapshots[0];
            data.groups = snapshots[1];
            data.device = '';
            data.device.id = '';
            data.title = 'Add New Device';
            res.render('devices-add', data);
        });
});

router.get('/update/:id', function(req, res, next) {
    var data = {};
    var deviceId = req.params.id;

    Promise.all([get('/devices', deviceId), list('/buildings'), list('/groups')])
        .then(function (snapshots) {
            data.device = snapshots[0];
            data.device.id = deviceId;
            data.buildings = snapshots[1];
            data.groups = snapshots[2];
            data.title = 'Update Device';
            res.render('devices-add', data);
        });
});

// form validation
router.post('/submit', function (req, res, next) {
        var groups = {};

        for (group in req.body['groups[]']) {
            groups[group] = true;
        }

        var device = {
            name: req.body.name,
            description: req.body.description,
            building: req.body.building,
            room: req.body.room,
            status: "available",
            groups: groups
        };
       createWithId('/devices', req.body.beaconId, device).then(function() {
           res.redirect('/devices/manage');
       });
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
    var deviceId = req.params.id;
    var data = [];

    Promise.all([get('/devices', deviceId)])
        .then(function (snapshots) {
            data.device = snapshots[0];
            data.beaconId = deviceId;
            data.title = 'Device Details';
            res.render('device-details', data);
        });
});

router.get('/remove/:id', function(req, res, next) {
    var deviceId = req.params.id;

    Promise.all([remove('/devices', deviceId)])
        .then(function (snapshots) {
            res.redirect('/devices/manage');
        });
});

router.post('/:deviceid/updatelocation', function(req, res, next) {
    var deviceid = req.params.deviceid;
    var roomid = req.body.roomid;
    var buildingid = req.body.buildingid;

    db.ref('/devices/'+deviceid).once('value').then(function(snapshot) {
        var device = snapshot.val();

        device.room = roomid;
        device.building = buildingid;

        db.ref('/devices/'+deviceid).set(device).then(function(){
            return res.statusCode(204);
        });
    });

});

module.exports = router;
