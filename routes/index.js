var express = require('express');
var router = express.Router();
var list = require('../firebase/list');
var _ = require('lodash');

/* GET home page. */
router.get('/', function(req, res, next) {

    Promise.all([list('/checkouts')])
        .then(function (snapshots) {
            var i = 0;
            var checkouts = {};
            var count = 0;
            _.forEach((snapshots[0]), function (checkout, index) {
                if (checkout.status === "failed") {
                    count++;
                }
            });

            console.log(checkouts);

            var data = {};
            data.title = 'Dashboard';
            data.count = count;
            res.render('index', data);
        });
});

module.exports = router;


