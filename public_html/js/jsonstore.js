/* global JSONStore */

define(['jquery', 'system', 'exceptions'], function($, sys, e) {
    var Jsonstore = function() {
        var token;
        var logContainer = $('#result-container');
        
        this.sync = function(token_, data, callback) {
            token = token_;
            console.log(token);
//            destroy();
            var collections = {
                // Object that defines the 'surveys' collection.
                surveys: {
                    // Object that defines the Search Fields for the 'surveys' collection.
                    searchFields: {id: 'string'}
                },
                users: {
                    searchFields: {id: 'string', name: 'string', email: 'string', offline: "string"}
                },
                surveyAnswer: {
                    searchFields: {id: 'string'}
                }
            };

            JSONStore.init(collections, {})
                    .then(function() {
                        return sendSurveyAnswers(function() {

                        });
                    })
                    .then(function() {
                        return flushData(data);
                    }).then(function() {
                (typeof callback === "function") ? callback() : null;
            });
        };

        var destroy = function() {
            return JSONStore.destroy()
                    .then(function() {
                        console.log("jsonsotre destroyed");
                    })
                    .fail(function(errorObject) {
                        console.log("error al destruir json store");
                        console.log(errorObject);
                    });
        };

        var storeSurveys = function(data) {
            console.log("storing surveys");
            log("almacenando encuestas");

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
                        log("Encuestas totales y sincronizadas: " + numberOfDocumentsAdded);
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
                        log("Error al sincronizar encuestas " + errorObject);
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
                        console.log("users added " + numberOfDocumentsAdded);
                        log("usuarios descargados y agregados al sistema: " + numberOfDocumentsAdded);
                    })
                    .then(function() {
                        return JSONStore.get(collectionName).findAll();
                    })
                    .fail(function(errorObject) {
                        // Handle failure for any of the previous JSONStore operations (init, add).
                        console.log("fail while searching users");
                        console.log(errorObject);
                        log("error al obtener usuarios " + errorObject);
                    })
                    .then(function(arrayResults) {
                        console.log("showing all users");
                        console.log(arrayResults);
                    })
                    .fail(function(errorObject) {
                        // Handle failure for any of the previous JSONStore operations (init, add).
                        console.log("fail while showing all users");
                        console.log(errorObject);
                    })
                    ;

        };

        var flushData = function(data) {
            console.log("flush data");
            log("limpiando información");
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
                        log("colección de encuestas vaciada correctamente");
                        storeSurveys(data.data);
                    })
                    .fail(function(errorObject) {
                        // Handle failure.
                        console.log("error while cleaning users");
                        log('Error al limpiar usuarios ' + errorObject);
                    });
        };

        var flushUsers = function(data) {
            console.log("flush users");
            var collectionName = 'users';
            return JSONStore.get(collectionName)
                    .clear()
                    .then(function() {
                        console.log("users collection cleaned");
                        log("colección de usuarios vaciada correctamente");
                        storeUsers(data.data);
                    })
                    .fail(function(errorObject) {
                        // Handle failure.
                        console.log("error while cleaning surveys " + errorObject);
                        log("error al limpiar encuestas " + errorObject);
                        return undefined;
                    });
        };

        var flushAnswers = function() {
            console.log("flush answers");
            log("limpiando respuestas");
            var collectionName = "surveyAnswer";
            return JSONStore.get(collectionName)
                    .clear()
                    .then(function() {
                        log("respuestas vaciadas correctamente");
                    })
                    .fail(function(errorObject) {
                        // Handle failure.
                        console.log("error while cleaning surveys");
                        log("Error al limpiar respuestas: " + errorObject);

                        return undefined;
                    });
        };

        var sendSurveyAnswers = function(callback) {
            console.log("sendSurveyAnswers");
            var collectionName = "surveyAnswer";
            return JSONStore.get(collectionName).findAll()
                    .then(function(arrayResults) {
                        var surveyAnswer = [];
                        $(arrayResults).each(function() {
                            surveyAnswer.push(this.json);
                        });

                        log("total de respuestas por enviar: " + surveyAnswer.length);
                        console.log(surveyAnswer);

                        if(!surveyAnswer.length > 0 )
                            return callback();
                        
                        $.ajax({
                            method: "POST",
                            async: false,
                            cache: false,
                            data: {surveyAnswer: surveyAnswer},
                            url: sys.getSystemPath() + "/surveyanswer/store/?token=" + token,
                            success: function(response, textStatus, jqXHR) {
                                if (typeof response !== 'object')
                                    e.error("Respuesta inesperada", response);
                                console.log(response);
                                if (response.status){
                                    log("respuestas enviadas y procesadas por el servidor correctamente");
                                    flushAnswers();
                                }else{
                                    log(response.error);
                                }


                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                e.manageError(jqXHR, textStatus, errorThrown);
                            }
                        });
                    })
                    .fail(function(errorObject) {
                        // Handle failure.
                        console.log("fail finding surveyAnswer");
                        console.log(errorObject);
                        log("error al obtener respuestas");
                        log(errorObject);
                    })
                    .then(function() {
                        callback();
                    });
        };

        var log = function(event) {
            $(logContainer).append(event + " \n");
        };

    };

    return new Jsonstore();
});