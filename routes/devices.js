var express = require('express');
var router = express.Router();

/* GET manage-devices page. */
router.get('/manage-devices', function(req, res, next) {
    res.render('manage-devices', { title: 'Manage Devices' });
});

module.exports = router;
