
/* global JSONStore */

define(['jquery', 'system', 'menu', 'exceptions'], function($, system, menu, e) {
    var Survey = function() {
        var self = this;
        var token = null;
        this.init = function() {
            //token = system.getUrlParameter("token");
            token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEsImlzcyI6Imh0dHA6XC9cLzE1OS4yMDMuMTY1LjYwOjgwMDBcL2F1dGhcL2xvZ2luIiwiaWF0IjoxNTQwMjc4MzExLCJleHAiOjE1NDE0ODc5MTEsIm5iZiI6MTU0MDI3ODMxMSwianRpIjoicFN6Y21nS2QwYlRHUUlzMSJ9.nXi0EyS-oTX5LJBhDCWj9r6qjKkn9-7X-9q7T0KPpqw'
            //setTokenValue();
            resizeContent();
            buildSurveyBoxes();
            engineSearch();

        };

        var resizeContent = function() {
            $('.background-products').css({width: $(window).width()});
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
                surveyType = [{"_id":1, "json":{"id": 1,"name": "Cuidado de la ropa","idSurveyType": 3, "survey_type": [{"id": 3,"name": "Ventas","icon": "https://shop.miele.com.mx/812-home_default/secadora-t1.jpg","color": "#7F7F7F"}]}},
                              {"_id":2, "json":{"id": 2,"name": "Experiencia culinaria","idSurveyType": 3, "survey_type": [{"id": 3,"name": "Ventas","icon": "https://shop.miele.com.mx/777-home_default/range-cooker.jpg","color": "#7F7F7F"}]}},
                              {"_id":3, "json":{"id": 3,"name": "Aspiradoras","idSurveyType": 3, "survey_type": [{"id": 3,"name": "Ventas","icon": "https://shop.miele.com.mx/533-home_default/complete-c3-parquet.jpg","color": "#7F7F7F"}]}},
                              {"_id":4, "json":{"id": 4,"name": "Accesorios y consumibles","idSurveyType": 3, "survey_type": [{"id": 3,"name": "Ventas","icon": "https://shop.miele.com.mx/396-home_default/soplador-externo-para-campana-profesional.jpg","color": "#7F7F7F"}]}}];
                $(surveyType).each(function() {
                    if(this.json !== undefined)
                        $('#boxContent').append(buildBox(this.json));
                    else
                        $('#boxContent').append(buildBox(this));                    
                });

                $('.survey').on('click', function() {
                    //var idSurvey = $(this).attr('idSurvey');
                    //(parseInt(idSurvey) > 0) ? system.goToSurveyInterface(token, idSurvey) : e.error("No fue posible abrir la encuesta", "No se obtuvo el identificador de la encuesta a contestar");
                    system.goToSublines(token);
                });
            });
        };

        var buildBox = function(survey) {
            var surveyTypeData = (survey.survey_type === undefined) ? {} : survey.survey_type[0];

            //var type = $('<div>', {class: "survey-type-title"}).append(surveyTypeData.name);
            //var name = $('<div>', {class: "survey-title"}).css({"background-color": surveyTypeData.color}).append(survey.name);
            var name = $('<div>', {class: "survey-title"}).append(survey.name);
            var icon = $('<div>', {class: "surveyType-icon"}).append($('<img>', {class: "surveyType-icon", src: surveyTypeData.icon}));
            //var button = $('<div>', {class: "button-play"}).append($('<img>', {src: "img/play-button.png"}));
            var box = $('<div>', {class: "box"}).append(icon).append(name);

            return $('<div>', {class: "col-sm-6 box-content survey", surveyName: survey.name, idSurvey: survey.id}).append(box);
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