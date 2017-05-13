var firebase = require('firebase');

/**
 *  Write the new object's data simultaneously in the endpoint list and the endpointRef list.
 *
 * @param endpoint {string}
 * @param endpointRef {string}
 * @param object {string}
 * @param refId {string|int}
 * @param values {Object}
 * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
 */
module.exports = function(endpoint, endpointRef, object,  refId, values) {
    var objectKey = firebase.database().ref().child(object).push().key;
    var updates = {};

    //
    updates[endpoint + "/" + objectKey] = values;
    updates[endpoint + "/" + refId + "/" + objectKey] = values;

    return firebase.database.ref().update(updates);
};
