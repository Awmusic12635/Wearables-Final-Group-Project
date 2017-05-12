var express = require('express');
var router = express.Router();
//var firebase = require('firebase');
//var db = firebase.database();

/* GET manage-devices page. */
router.get('/', function(req, res, next) {
    // pull item from /cart in firebase
    db.ref('/cart').once('value').then(function(snapshot){
       console.dir(snapshot);
    });
    // render the template with that item
    res.render('checkout', { title: 'Cart' });
});

// Add item to checkout
router.get('/add/:item_id', function(req, res, next) {
    // search firebase for item by item_id

    // take that item and then update the cart item to be that item

    // return back that item is added

    res.render('rfid-manage', { title: 'Manage RFID Access' });
});

//check if person has permission to checkout a specific item
// Photon uses this so it returns json
router.get('/check/:rfid', function(req, res, next) {
    // lookup user based on the rfid for that person

    // pull the current item from /cart firebase

    // pull groups from firebase

    // check if that person's group is authorized to check it out.

    // if yes then check out the item to the person in /checkout

    // if not then return failed and marked it as a failed attempt in /checkout
    res.render('rfid-manage', { title: 'Manage RFID Access' });
});


module.exports = router;
