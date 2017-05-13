var express = require('express');
var list = require('../firebase/list');

var router = express.Router();
var firebase = require('firebase');
var db = firebase.database();

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

router.get('/details/:id', function(req, res, next) {
    console.log(req.param('id'));
    user = req.params.id;
    res.render('devices-details', { title: 'Manage Device Groups', user: user });
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
