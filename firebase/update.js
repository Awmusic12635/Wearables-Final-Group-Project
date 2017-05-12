var firebase = require('firebase');

module.exports = function(endpoint, object, values) {
    var objectKey = firebase.database().ref().child(object).push().key;
    return firebase.database().ref(endpoint + "/" + id).set(values);
};