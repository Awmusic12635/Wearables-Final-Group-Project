var express = require('express');
var router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/manage', function(req, res, next) {
    res.render('users-manage', { title: 'Manage Users' });
});

router.get('/groups', function (req, res, next) {
   res.render('users-groups', { title: 'Manage User Groups'})
});

router.get('/details/:id', function(req, res, next) {
    console.log(req.params.id);
    res.render('users-details', { title: 'User Detail' });
});

module.exports = router;
