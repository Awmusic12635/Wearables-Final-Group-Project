var express = require('express');
var router = express.Router();
var _ = require('lodash');

var list = require('../firebase/list');
var get = require('../firebase/get');
var remove = require('../firebase/delete');
var createWithId = require('../firebase/create-id');

/* adds a new user */
router.get('/add', function(req, res, next) {
    Promise.all([list('/groups')])
        .then(function (snapshots) {
            var data = {};
            data.groups = snapshots[0];
            data.title = 'Add New User';
            data.user = '';
            data.user.id = '';
            res.render('rfid-users-add', data);
        });
});

/* adds a new user */
router.get('/update/:id', function(req, res, next) {
    var userId = req.params.id;

    Promise.all([get('/users', userId), list('/groups')])
        .then(function (snapshots) {
            var data = {};
            data.groups = snapshots[1];
            data.title = 'Update User';
            data.user = snapshots[0];
            data.user.id = userId;
            res.render('rfid-users-add', data);
        });
});

/* form validation for new user */
router.post('/submit', function (req, res, next) {
    var groups = {};

    if (!_.isArray(req.body['groups[]']) && !_.isEmpty(req.body['groups[]'])) {
        group[req.body['groups[]']] = true;
    } else if (_.isArray(req.body['groups[]'])){
        _.forEach(req.body['groups[]'], function (value, index) {
            groups[value] = [true];
        });
    }



    var device = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        groups: groups
    };
    createWithId('/users', req.body.rfidID, device).then(function() {
        res.redirect('/users/rfid/manage');
    });
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

router.get('remove/:id', function (req, res, next) {
    var userId = req.params.id;

    Promise.all([remove('/users', userId), list('/users')])
        .then(function (snapshots) {
            data.devices = snapshots[0];
            data.title = 'Manage Devices';
            res.render('devices-manage', data);
        });
});

router.get('/details/:id', function(req, res, next) {
    var userId = req.params.id;
    var data = [];

    Promise.all([get('/users', userId)])
        .then(function (snapshots) {
            data.user = snapshots[0];
            data.rfidID = userId;
            data.title = 'Manage Devices';
            res.render('user-details', data);
        });
});

router.get('/remove/:id', function(req, res, next) {
    var userID = req.params.id;

    Promise.all([remove('/users', userID)])
        .then(function (snapshots) {
            res.redirect('/users/rfid/manage');
        });
});

/* GET devices groups page. */
router.get('/failed', function(req, res, next) {
    Promise.all([list('/checkouts')])
        .then(function (snapshots) {
            var i = 0;
            var checkouts = {};

            _.forEach((snapshots[0]), function (checkout, index) {
                if (checkout.status === "failed") {
                    Promise.all([
                        get('/devices', checkout.device),
                        get('/users', checkout.user)
                    ]).then(function (snapshot2) {
                        var d = {};
                        checkout.device = snapshot2[0];
                        d.user = snapshot2[1];
                        return d;
                    });
                    checkouts[index] = checkout;
                }
            });

            var data = {};
            data.title = 'Failed Attempts';
            data.checkouts = checkouts;
            res.render('rfid-failed-attempts', data);
        });

});

module.exports = router;
