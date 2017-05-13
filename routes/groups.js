var express = require('express');
var router = express.Router();
var list = require('../firebase/list');

router.get('/manage', function(req, res, next) {
    var data = {};

    Promise.all([list('/groups')])
        .then(function (snapshots) {
            data.groups = snapshots[0];
            // data.userCount = (snapshots[0].users).length;

            data.title = 'Manage User Groups';
            res.render('groups-manage', data);
        });
});

router.get('/assignments', function (req, res, next) {
    res.render('groups-users', { title: 'Manage User Groups'})
});


// router.get('/groups', function (req, res, next) {
//    res.render('groups-users', { title: 'Manage User Groups'})
// });

router.get('/details/:id', function(req, res, next) {
    console.log(req.params.id);
    res.render('users-details', { title: 'User Detail' });
});

module.exports = router;
