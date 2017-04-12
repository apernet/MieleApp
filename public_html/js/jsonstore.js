/* global JSONStore */

define(['jquery'], function($) {
    var Jsonstore = function() {
        this.sync = function(data, callback) {
            console.log("JSONSTORE");
            var collections = {
                // Object that defines the 'people' collection.
                surveys: {
                    // Object that defines the Search Fields for the 'people' collection.
                    searchFields: {id: 'string'}
                },
                users: {
                    searchFields: {id: 'string'}
                }
            };

            JSONStore.init(collections, {})
                    .then(function() {
                        return flushData(data);
                    }).then(function() {
                (typeof callback === "function") ? callback() : null;
            });

        };

        var storeSurveys = function(data) {
            console.log("storing surveys");

            var collectionName = 'surveys';
            // Object that defines all the collections.

            // Optional options for add.
            var addOptions = {
                markDirty: true // Mark data as dirty (true = yes, false = no), default true.
            };

            return JSONStore.get(collectionName)
                    .add(data.surveys, addOptions)
                    .then(function(numberOfDocumentsAdded) {
                        // Add was successful.
                        console.log("surveys added: " + numberOfDocumentsAdded);
                        return JSONStore.get(collectionName).findAll();
                        // Alternatives:
                        // - findById(1, options) which locates documents by their _id field
                        // - findAll(options) which returns all documents
                        // - find({'name': 'ayumu', age: 10}, options) which finds all documents
                        // that match the query.

                    })
                    .fail(function(errorObject) {
                        // Handle failure for any of the previous JSONStore operations (init, add).
                        console.log("fail storing surveys");
                        console.log(errorObject);
                    })
                    .then(function(arrayResults) {
                        // arrayResults = [{_id: 1, json: {name: 'ayumu', age: 10}}]
                        console.log("showing surveys");
                        console.log(arrayResults);
                    })
                    .fail(function(errorObject) {
                        // Handle failure.
                        console.log("fail finding surveys");
                        console.log(errorObject);
                    });

        };

        var storeUsers = function(data) {
            console.log("storing users");
            var collectionName = 'users';

            var addOptions = {
                markDirty: true   // Mark data as dirty (true = yes, false = no), default true.
            };
            // Get an accessor to the people collection and add data.
            return JSONStore.get(collectionName)
                    .add(data.users, addOptions)
                    .then(function(numberOfDocumentsAdded) {
                        // Add was successful.
                        console.log("users added: " + numberOfDocumentsAdded);

                        return JSONStore.get(collectionName).findAll();
                    })
                    .fail(function(errorObject) {
                        // Handle failure for any of the previous JSONStore operations (init, add).
                        console.log("fail while storing users");
                        console.log(errorObject);
                    })
                    .then(function(arrayResults) {
                        console.log("showing users");
                        console.log(arrayResults);
                    })
                    .fail(function(errorObject) {
                        // Handle failure for any of the previous JSONStore operations (init, add).
                        console.log("fail while showing users");
                        console.log(errorObject);
                    });

        };

        var flushData = function(data) {
            console.log("flush data");
            var collectionName = 'surveys';
            return ((JSONStore.get(collectionName) === undefined) ? storeSurveys(data.data) : flushSurveys(data)).then(function() {
                collectionName = 'users';
                return ((JSONStore.get(collectionName) === undefined) ? storeUsers(data.data) : flushUsers(data));
            });
        };

        var flushSurveys = function(data) {
            console.log("flush surveys");
            var collectionName = 'surveys';

            return JSONStore.get(collectionName)
                    .clear()
                    .then(function() {
                        console.log("surveys collection cleaned");
                        storeSurveys(data.data);
                    })
                    .fail(function(errorObject) {
                        // Handle failure.
                        console.log("error while cleaning users");
                    });
        };

        var flushUsers = function(data) {
            console.log("flush users");
            var collectionName = 'users';
            return JSONStore.get(collectionName)
                    .clear()
                    .then(function() {
                        console.log("users collection cleaned");
                        storeUsers(data.data);
                    })
                    .fail(function(errorObject) {
                        // Handle failure.
                        console.log("error while cleaning surveys");
                        return undefined;
                    });
        };

    };

    return new Jsonstore();
});