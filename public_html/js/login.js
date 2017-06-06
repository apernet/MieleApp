/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global JSONStore */

define(['jquery', 'alerts', 'validator', 'exceptions', 'system'], function($, alerts, validator, exceptions, system) {
    var Login = function() {
        var loginContainer = $('#login-container');
        this.init = function() {
            $(document).ready(function() {
                removeAlerts();
                $('#btnLogin').click(function(e) {
                    e.preventDefault();
                    validateFields();
                });
            });
        };

        var validateFields = function() {
            var inputUserName = $('#inputEmail');
            var inputPassword = $('#inputPassword');

            removeAlerts();

            if (inputUserName.val().length === 0) {
                addAlerts("*El email es obligatorio");
                alerts.addFormError(inputUserName);
            } else if (!validator.email(inputUserName.val())) {
                addAlerts("*Debe introducir un email válido");
                alerts.addFormError(inputUserName);
            }

            if (inputPassword.val().length === 0) {
                addAlerts('*El password es obligatorio');
                alerts.addFormError(inputPassword);
            }

            if (isHasErrors())
                return 0;

            removeAlerts();
//            localLogin();
            (checkInternetConnection()) ? remoteLogin() : localLogin();
        };

        var remoteLogin = function() {
            console.log("remote login");
            $.ajax({
                method: "POST",
                async: false,
                cache: false,
                data: loginContainer.closest('form').serialize(),
                url: system.SERVER + "/auth/login/",
                success: function(response, textStatus, jqXHR) {
                    manageResponse(response);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    var response = jqXHR.responseJSON;
                    $('#inputPassword').val('');
                    if (response === undefined)
                        return addAlerts(jqXHR.statusText + " - " + jqXHR.status, jqXHR.responseText);
                }
            });
        };

        var localLogin = function() {
            console.log("local login");
            var collectionName = "users";
            var email = $.trim($('#inputEmail').val());
            var offline = $.trim($('#inputPassword').val());
            var query = {email: email, offline: offline};
            var options = {
                exact: false,
                limit: 1 //returns a maximum of 10 documents
            };
            console.log(query);
            return JSONStore.init({
                users: {
                    searchFields: {id: 'string', name: 'string', email: 'string', offline: "string"}
                }
            })
//                    .then(function() {
//                        return JSONStore.get(collectionName).findAll();
//                    })
//                    .fail(function(errorObject) {
//                        // Handle failure for any of the previous JSONStore operations (init, add).
//                        console.log("fail while showing users");
//                        console.log(errorObject);
//                    })
                    .then(function() {
//                        console.log("showing users");
//                        console.log(arrayResults);
                        return JSONStore.get(collectionName)
                                .find(query, options);
                    })
                    .fail(function(error) {
                        console.log("Error al realizar login. " + error);
                        addAlerts("Error al realizar login. " + error);
                    })
                    .then(function(arrayResults) {
                        console.log("resultados");
                        console.log(arrayResults);
                        $('#inputPassword').val('');

                        if (arrayResults.length > 0)
                            accessToSystem(null);
                    });
        };

        var checkInternetConnection = function() {
            var url = system.SERVER + "/api/status/";
            console.log("Comprobando conexión en:  " + url);
            var status = false;
            $.ajax({
                method: "POST",
                async: false,
                cache: false,
                data: [],
                url: url,
                success: function(response, textStatus, jqXHR) {
                    console.log("Success:");
                    console.log(response);
                    if (response.status)
                        status = true;
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("error:");
                    console.log(textStatus);
                    console.log(jqXHR);
                    var response = jqXHR.responseJSON;
                    $('#inputPassword').val('');
                    if (response === undefined)
                        return addAlerts(jqXHR.statusText + " - " + jqXHR.status, jqXHR.responseText);
                }
            });
            return status;
        };

        var manageResponse = function(response) {
            if (typeof response !== 'object')
                return denyAccess("internal server error. " + response);

            if (response.status !== true) {
                if (response.message !== undefined)
                    denyAccess(response.message);
                else
                    denyAccess(exceptions.INTERNAL_SERVER_ERROR);
            } else {
                if (response.status)
                    accessToSystem(response.token);
            }

        };

        var accessToSystem = function(token) {
            window.location.href = "home.html?token=" + token;
        };

        var denyAccess = function(message) {
            $('#inputPassword').val('');
            addAlerts(message);
        };

        var isHasErrors = function() {
            var status = 0;
            $(loginContainer).find('input').each(function() {
                if (alerts.isHasFormError($(this)))
                    status = 1;
            });

            return status;
        };

        var removeAlerts = function() {
            $(loginContainer).find('input').each(function() {
                alerts.removeFormError(this);
            });

            $('.login-alerts').hide().empty();
        };

        var addAlerts = function(message) {
            $('.login-alerts').show().append("<p>" + message + "</p>");
        };
    };

    var login = new Login();
    login.init();

    return true;
});
