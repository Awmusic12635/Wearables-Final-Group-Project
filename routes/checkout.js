var express = require('express');
var router = express.Router();

var list = require('../firebase/list');
var firebase = require('firebase');
var db = firebase.database();

/* GET manage-devices page. */
router.get('/', function(req, res, next) {
    // pull item from /cart in firebase
    db.ref('/cart').once('value').then(function(snapshot){
        var deviceId = snapshot.val().device;

        db.ref('/devices/'+deviceId).once('value').then(function(snapshot2){

            var device = snapshot2.val();

            // render the template with that item
            res.render('checkout', { title: 'Cart' , device:device, cartStatus: snapshot.val().status});
        });
    });
});

// Add item to checkout
router.get('/add/:device_id', function(req, res, next) {
    // search firebase for item by device_id

    db.ref('/devices/'+req.params.device_id).once('value').then(function(snapshot) {
        var device = snapshot.val();

        // user does not exist
        if(device == null){
            return res.status(404);
        }
        var cart = {};
        cart.device = req.params.device_id;
        cart.status="open";
        // take that item and then update the cart item to be that item
        db.ref('/cart').set(cart).then(function() {
            // return back that item is added
            return res.status(204);
        });
    });
});

//check if person has permission to checkout a specific item
// Photon uses this so it returns json
router.get('/check/:rfid', function(req, res, next) {
    // lookup user based on the rfid for that person
    db.ref('/users/'+req.params.rfid).once('value').then(function(snapshot) {
        var user = snapshot.val();

        // user does not exist
        if(user == null){
            return res.json({status:"failed"});
        }

        // pull the current item from /cart firebase
        db.ref('/cart').once('value').then(function(snapshot1) {
            var deviceId = snapshot1.val().device;

            db.ref('/devices/'+deviceId).once('value').then(function(snapshot3) {
                var device = snapshot3.val();

                // pull groups from firebase
                db.ref('/groups').once('value').then(function (snapshot2) {
                    // check if that person's group is authorized to check it out.
                    var groups = snapshot2.val();

                    var canCheckout = false;
                    for (var group in user.groups){
                        if(groups[group]['devices'] != undefined) {
                            if (groups[group]['devices'][deviceId] != undefined) {
                                canCheckout = true;
                            }
                        }
                    }
                    // if yes then check out the item to the person in /checkout
                    if (canCheckout) {
                        device.status = "checked out";

                        db.ref('/devices/'+deviceId).set(device).then(function(){
                            var checkout ={};

                            checkout.device = deviceId;
                            checkout.status = "success";
                            checkout.timestamp = Date.now();
                            checkout.user = req.params.rfid;

                            db.ref('/checkouts').push(checkout).then(function(){
                                return res.json({status:"success"});
                            });
                        });
                    } else {
                        // if not then return failed and marked it as a failed attempt in /checkout
                        var checkout ={};

                        checkout.device = deviceId;
                        checkout.status = "failed";
                        checkout.timestamp = Date.now();
                        checkout.user = req.params.rfid;

                        db.ref('/checkouts').push(checkout).then(function(){
                            return res.json({status:"failed"});
                        });
                    }
                });
            });
        });
    });
});


module.exports = router;
