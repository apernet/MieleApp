define(['jquery', 'menu', 'system', 'exceptions', 'jsonstore', 'alerts', 'validator'], function($, menu, system, e, jsonstore, alerts, validator) {
    var Sync = function() {
        var self = this;
        this.init = function() {

            $(document).ready(function() {
                initMenu();
                $('#sync-now').on("click", function() {
                    var button = $(this).hide();

                    sync(button);
                });
            });

        };

        var sync = function(button) {
            var params = validateFields();
            console.log("params");
            console.log(params);
            if (params === 0){
                button.show();
                return 0;
            }
            
            var token = getToken(params);
            if(token === false)
                return 0;
            
            self.storeLocalData(token, function() {
                $(button).show();
            });
        };

        var validateFields = function() {
            var inputUserName = $('#user');
            var inputPassword = $('#password');

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

            return {email: inputUserName.val(), password: inputPassword.val()};
        };

        var isHasErrors = function() {
            var status = 0;
            $('#sync-container').find('input').each(function() {
                if (alerts.isHasFormError($(this)))
                    status = 1;
            });

            return status;
        };
        
        var removeAlerts = function() {
            $('#sync-container').find('input').each(function() {
                alerts.removeFormError(this);
            });

            $('.login-alerts').hide().empty();
        };

        var getToken = function(params) {
            var token = false;
            console.log(params);
            $.ajax({
                method: "POST",
                async: false,
                cache: false,
                data: params,
                url: system.SERVER + "/auth/login/",
                success: function(response, textStatus, jqXHR) {
                    if (response.status)
                        token = response.token;
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    var response = jqXHR.responseJSON;
                    $('#inputPassword').val('');
                    if (response === undefined)
                        return addAlerts(jqXHR.statusText + " - " + jqXHR.status, jqXHR.responseText);
                }
            });
            return token;
        };

        var initMenu = function(token) {
            menu.init({
                buttonSelector: "menu-toggle",
                pageWrapper: "pageWrapper",
                brandTitle: "Miele",
                options: [
                    menu.option.goToHome(token),
                    menu.option.closeSessionOption(token)
                ]
            });
        };

        var getData = function(token) {
            var data = null;
            $.ajax({
                method: "POST",
                async: false,
                cache: false,
                data: {},
                url: system.getSystemPath() + "/sync/?token=" + token,
                success: function(response, textStatus, jqXHR) {
                    if (typeof response !== 'object')
                        e.error("Respuesta inesperada", response);

                    data = response;
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                    e.error(jqXHR.statusText + " - " + jqXHR.status, jqXHR.responseText + "<br>" + errorThrown, function() {
                        system.gotToLogin();
                    });
                }
            });
            return data;
        };

        this.storeLocalData = function(token, callback) {
            var data = getData(token);
            var local = jsonstore.sync(token, data, callback);
        };
    };

    return new Sync();
});