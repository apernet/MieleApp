
/* global JSONStore */

define(['jquery', 'system', 'menu', 'exceptions'], function($, system, menu, e) {
    var Survey = function() {
        var self = this;
        var token = null;
        this.init = function() {
            token = system.getUrlParameter("token");
            setTokenValue();
            resizeContent();
            buildSurveyBoxes();
            engineSearch();

        };

        var resizeContent = function() {
            $('#boxContent').height($(window).height() - 150);
            buildMenu();
        };

        var buildMenu = function() {
            menu.init({
                buttonSelector: "menu-toggle",
                pageWrapper: "pageWrapper",
                brandTitle: "Miele",
                options: [
                    menu.option.goToHome(token),
                    menu.option.sync(token),
                    menu.option.closeSessionOption(token)
                ]
            });
        };

        var buildSurveyBoxes = function() {
            self.getSurveys(function(surveyType) {
                surveyType = [{"_id":1, "json":{"id": 1,"name": "Lavadoras","idSurveyType": 3, "survey_type": [{"id": 3,"name": "Ventas","icon": "https://shop.miele.com.mx/811-home_default/lavadora-w1.jpg","color": "#7F7F7F"}]}},
                              {"_id":2, "json":{"id": 2,"name": "Lavadoras","idSurveyType": 3, "survey_type": [{"id": 3,"name": "Ventas","icon": "https://shop.miele.com.mx/811-home_default/lavadora-w1.jpg","color": "#7F7F7F"}]}},
                              {"_id":3, "json":{"id": 3,"name": "Lavadoras","idSurveyType": 3, "survey_type": [{"id": 3,"name": "Ventas","icon": "https://shop.miele.com.mx/811-home_default/lavadora-w1.jpg","color": "#7F7F7F"}]}},
                              {"_id":4, "json":{"id": 4,"name": "Lavadoras","idSurveyType": 3, "survey_type": [{"id": 3,"name": "Ventas","icon": "https://shop.miele.com.mx/811-home_default/lavadora-w1.jpg","color": "#7F7F7F"}]}},
                              {"_id":5, "json":{"id": 5,"name": "Lavadoras","idSurveyType": 3, "survey_type": [{"id": 3,"name": "Ventas","icon": "https://shop.miele.com.mx/811-home_default/lavadora-w1.jpg","color": "#7F7F7F"}]}},
                              {"_id":6, "json":{"id": 6,"name": "Lavadoras","idSurveyType": 3, "survey_type": [{"id": 3,"name": "Ventas","icon": "https://shop.miele.com.mx/811-home_default/lavadora-w1.jpg","color": "#7F7F7F"}]}}];
                $(surveyType).each(function() {
                    if(this.json !== undefined)
                        $('#boxContent').append(buildBox(this.json));
                    else
                        $('#boxContent').append(buildBox(this));                    
                });

                $('.survey').on('click', function() {
                    //var idSurvey = $(this).attr('idSurvey');
                    //(parseInt(idSurvey) > 0) ? system.goToSurveyInterface(token, idSurvey) : e.error("No fue posible abrir la encuesta", "No se obtuvo el identificador de la encuesta a contestar");
                    system.goToProductDesc(token);
                });
            });
        };

        var buildBox = function(survey) {
            var surveyTypeData = (survey.survey_type === undefined) ? {} : survey.survey_type[0];

            var name = $('<div>', {class: "product-title"}).append('LAVADORA W1');//survey.name
            var description = $('<div>', {class: "product-description"}).append('Capacidad de carga 9kg.');//surveyTypeData.name
            var button = $('<div>', {class: "product-button"}).append('Ver Producto');
            var icon = $('<div>', {class: "surveyType-icon"}).append($('<img>', {class: "surveyType-icon", src: surveyTypeData.icon}));
            var box = $('<div>', {class: "box"}).append(icon).append(name).append(description).append(button);

            return $('<div>', {class: "col-sm-4 box-content survey", surveyName: survey.name, idSurvey: survey.id}).append(box);
        };

        /**
         * 
         * @param {type} token
         * @returns {response}
         */
        var getRemoteSurveys = function(token) {
            var surveys = null;
            $.ajax({
                method: "POST",
                async: false,
                cache: false,
                data: {},
                url: system.getSystemPath() + "/survey/?token=" + token,
                success: function(response, textStatus, jqXHR) {
                    if (typeof response !== 'object')
                        e.error("Respuesta inesperada", response);

                    surveys = response;
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                    e.error(jqXHR.statusText + " - " + jqXHR.status, jqXHR.responseText+"<br>"+errorThrown, function(){
                        system.gotToLogin();
                    });
                }
            });
            return surveys;
        };

        this.getSurveys = function(callback) {
            if(typeof JSONStore !== 'undefined'){
                return JSONStore.init({surveys: {searchFields: {id: 'string'}}})
                        .then(function() {
                            return JSONStore.get("surveys").findAll();
                        })
                        .fail(function(error) {
                            alert("Error al obtener encuestas: " + error);
                        })
                        .then(function(arrayResults) {
                            if (typeof callback === "function")
                                callback(arrayResults);
                        });
                    }
            else{
                var surveysList = getRemoteSurveys(token);
                return callback(surveysList);
            }
        };

        var engineSearch = function() {
            $('#formSearch').keyup(function() {
                searchSurvey($.trim($(this).val()));
            });
        };

        var searchSurvey = function(surveyName) {
            var regex = new RegExp("(" + surveyName + ")", "ig");
            $('.box-content').each(function() {
                if (String(surveyName).length === 0) {
                    $('.box-content').show();
                    return false;
                }

                (String($(this).attr('surveyName')).search(regex) === -1) ? $(this).hide() : $(this).show();
            });
        };

        var setTokenValue = function() {
            token = system.getUrlParameter("token");
        };

        this.getSurvey = function(idSurvey, callback) {
            var query = {id: idSurvey};
            if(typeof JSONStore !== 'undefined')
                return JSONStore.init({surveys: {searchFields: {id: 'string'}}})
                        .then(function() {
                            return JSONStore.get("surveys")
                            .find(query, {});
                        })
                        .fail(function(error) {
                            alert("Error al obtener encuesta: " + error);
                        })
                        .then(function(arrayResults) {
                            arrayResults = (typeof arrayResults[0].json !== undefined) ? arrayResults[0].json : null;

                            if (typeof callback === "function")
                                callback(arrayResults);
                            else
                                return arrayResults;
                        });
            else
                callback(getRemoteSurvey(idSurvey));
        };
        var getRemoteSurvey = function(idSurvey) {
            setTokenValue();
            var survey = null;
            $.ajax({
                method: "POST",
                async: false,
                cache: false,
                data: {},
                url: system.getSystemPath() + "/survey/?id=" + idSurvey + "&token=" + token,
                success: function(response, textStatus, jqXHR) {
                    if (typeof response !== 'object')
                        e.error("Respuesta inesperada", response);

                    survey = response;
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    e.manageError(jqXHR, textStatus, errorThrown);
                }
            });
            return (survey[0] !== undefined) ? survey[0] : null;
        };
    };

    return new Survey();
});