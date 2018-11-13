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
            $('#result-container').empty();
            
            if (params === 0){
                button.show();
                return 0;
            }
            
            var token = getToken(params);
            
            button.show();
            
            if(token === false || token === undefined){
                return 0;
            }

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
        
        var addAlerts = function(message) {
            $('.login-alerts').show().append("<p>" + message + "</p>");
        };

        var getToken = function(params) {
            var token = false;
          
            $.ajax({
                method: "POST",
                async: false,
                cache: false,
                data: params,
                url: system.SERVER + "/auth/login/",
                success: function(response, textStatus, jqXHR) {
                    if (response.status){
                        $('.result-container').append("Ingreso al sistema... \n");
                        token = response.token;
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    var response = jqXHR.responseJSON;
                    $('#inputPassword').val('');
                    if (response === undefined)
                        return addAlerts(jqXHR.statusText + " - " + jqXHR.status, jqXHR.responseText);
                    
                    addAlerts(response.message);
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
            //var data = getData(token);
            //console.log(data);
            var newData = {
                status: 1, 
                message: "usted se esta sincronizando", 
                data: {
                    users: [
                        {address: null, created_at: null, email: "admin.miele@aper.net", id: 1, idRole: 1, last_name: null, mobile_phone: null, mothers_last_name: null, name: "admin", offline: "admin"}
                    ], 
                    lines: [
                        {"id": 1,"name": "Cuidado de la ropa","idSurveyType": 3, "survey_type": [{"id": 3,"name": "Ventas","icon": "https://shop.miele.com.mx/812-home_default/secadora-t1.jpg","color": "#7F7F7F"}]},
                        {"id": 2,"name": "Experiencia culinaria","idSurveyType": 3, "survey_type": [{"id": 3,"name": "Ventas","icon": "https://shop.miele.com.mx/777-home_default/range-cooker.jpg","color": "#7F7F7F"}]},
                        {"id": 3,"name": "Aspiradoras","idSurveyType": 3, "survey_type": [{"id": 3,"name": "Ventas","icon": "https://shop.miele.com.mx/533-home_default/complete-c3-parquet.jpg","color": "#7F7F7F"}]},
                        {"id": 4,"name": "Accesorios y consumibles","idSurveyType": 3, "survey_type": [{"id": 3,"name": "Ventas","icon": "https://shop.miele.com.mx/396-home_default/soplador-externo-para-campana-profesional.jpg","color": "#7F7F7F"}]}
                    ]
                }
            };
            //var name = 'lines';
            //console.log(newData.data[name]);
            //return 0;
            var local = jsonstore.syncCatalog(token, newData, callback);
            console.log('newData has been saved');
        };
    };

    return new Sync();
});