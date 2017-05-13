var express = require('express');
var router = express.Router();
var list = require('../firebase/list');
var createWithId = require('../firebase/create-id');
var get = require('../firebase/get');
var remove = require('../firebase/delete');
var _ = require('lodash');
var db = require('firebase').database();

/* GET devices groups page. */
router.get('/groups', function(req, res, next) {
    res.render('devices-groups', { title: 'Manage Device Groups' });
});

router.get('/add', function(req, res, next) {
    var data = {};

    Promise.all([list('/permissions')])
        .then(function (snapshots) {
            data.group = '';
            data.permissions = snapshots[0];
            data.title = 'Add New Group';
            res.render('groups-add', data);
        });
});

router.get('/update/:id', function(req, res, next) {
    var data = {};
    var groupId = req.params.id;

    Promise.all([get('/groups', groupId), list('/permissions')])
        .then(function (snapshots) {
            data.group = snapshots[0];
            data.group.name = groupId;
            data.permissions = snapshots[1];
            data.title = 'Update Group';
            res.render('groups-add', data);
        });
});

// form validation
router.post('/submit', function (req, res, next) {
    var group = {};

    _.forEach(req.body['permissions[]'], function (value, index) {
        group[value] = [true];
    });

    var name = req.body.name;
    createWithId('/groups', req.body.name, group).then(function() {
        res.redirect('/users/groups/manage');
    });
});

router.get('/manage', function(req, res, next) {
    var data = {};

    Promise.all([list('/groups')])
        .then(function (snapshots) {
            data.groups = snapshots[0];

            data.title = 'Manage User Groups';
            res.render('groups-manage', data);
        });
});

router.get('/assignments', function (req, res, next) {
    var groups = {};
    
    function setUserValue(id, value) {
        groups.user[id] = value;
    }
    
    Promise.all([list('/groups')])
        .then(function(snapshot){
            var groups = {};

            console.log(snapshot[0]);
            // get the group users
            _.forEach(snapshot[0], function(group, id){
                groups[id] = group.users;
            });

            var data = {};
            data.groups = groups;
            data.title = 'Manage User Groups';

            console.log(data);

            res.render('groups-users', data) ;
        });

});


router.get('/remove/:id', function(req, res, next) {
    var groupId = req.params.id;

    Promise.all([remove('/groups', groupId)])
        .then(function (snapshots) {
            res.redirect('/users/groups/manage');
        });
});

router.get('/assignment/remove/:id', function(req, res, next) {
    var groupId = req.params.id;

    Promise.all([remove('/groups', groupId)])
        .then(function (snapshots) {
            res.redirect('/users/groups/manage');
        });
});


router.get('/details/:id', function(req, res, next) {
    console.log(req.params.id);
    res.render('users-details', { title: 'User Detail' });
});

module.exports = router;
