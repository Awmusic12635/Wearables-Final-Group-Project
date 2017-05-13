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
            data.group.name = '';
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
            
            var checkedPermissions = [];
            _.forEach(data.group, function(group, index) {
                if (index !== "users") {
                    checkedPermissions.push(index);
                }
            });

            data.checkedPermissions = checkedPermissions;
            
            data.title = 'Update Group';
            res.render('groups-add', data);
        });
});

// form validation
router.post('/submit', function (req, res, next) {
    var group = {};

    if (!_.isArray(req.body['permissions[]']) && !_.isEmpty(req.body['permissions[]'])) {
        group[req.body['permissions[]']] = true;
    } else if (_.isArray(req.body['permissions[]'])){
        _.forEach(req.body['permissions[]'], function (value, index) {
            group[value] = [true];
        });
    }

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
            
            // get the group users
            _.forEach(snapshot[0], function(group, id){
                groups[id] = group.users;
            });

            var data = {};
            data.groups = groups;
            data.title = 'Manage User Groups';


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

router.get('/:groupId/remove/:userId', function(req, res, next) {
    var groupId = req.params.groupId;
    var userId = req.params.userId;

    Promise.all([db.ref('/groups/' + groupId + '/users/' + userId).set(null)])
        .then(function (snapshots) {
            res.redirect('/users/groups/assignments');
        });
});

router.get('/details/:id', function(req, res, next) {
    res.render('users-details', { title: 'User Detail' });
});

router.get('/:groupId/add/', function (req, res, next) {
    var groupId = req.params.groupId;
    var data = {};

    Promise.all([list('/users'), list('/groups')])
        .then(function (snapshots) {
            data.group = groupId;
            data.users = snapshots[0];
            
            var checkedUsers = [];
            var temp = snapshots[1];
            _.forEach(temp[groupId].users, function(t, index) {
                checkedUsers.push(index);
            });
            
            data.checkedUsers = checkedUsers;
            data.title = 'Add Users to ' + groupId;
            res.render('groups-add-user', data);
        });
});

router.post('/:groupId/submit', function(req, res, next) {
    var users = {};
    var groupId = req.params.groupId;

    if (!_.isArray(req.body['users[]']) && !_.isEmpty(req.body['users[]'])) {
        group[req.body['users[]']] = true;
    } else if (_.isArray(req.body['permissions[]'])){
        _.forEach(req.body['users[]'], function (value, index) {
            users[value] = [true];
        });
    }


    var name = req.params.id;
    //
    Promise.all([db.ref('/groups/' + groupId + '/users').set(users)])
        .then(function (snapshots) {
            _.forEach(users, function(user, index) {
                Promise.all(db.ref('/users/' + index + '/groups/' + groupId).set(true));
                Promise.all(db.ref('/users/' + index + '/groups/' + groupId).set(true));
            });
            res.redirect('/users/groups/assignments');
        });
});

module.exports = router;
