
define(['jquery', 'system'], function($, e) {
    var system = function() {
        var self = this;

        var port = 8000;

        this.SERVER = "http://" + window.location.hostname + ":" + port;
        this.getApiPath = function() {
            return "/api/v1";
        };

        this.getSystemPath = function() {
            return self.SERVER + self.getApiPath();
        };

        this.menu = {
            option: {
                /**
                 * 
                 * @param {type} token
                 * @returns {systemL#2.system.menu.option.closeSessionOption.systemAnonym$1}
                 */
                closeSessionOption: function(token) {
                    var url = self.SERVER + self.getApiPath() + "/auth/invalidate";

                    return {
                        title: "Cerrar Sesión",
                        onclick: {
                            ajax: {
                                url: url,
                                params: {"token": token},
                                method: "POST",
                                async: false,
                                success: function(response, textStatus, jqXHR) {
                                    if (typeof response !== "object")
                                        e.error(response);

                                    if (response.status)
                                        window.location.href = "login.html";
                                    else
                                        e.error("Error", response.message);
                                }
                            }
                        }
                    };
                },
                goToHome: function(token) {
                    return {
                        title: "Home",
                        onclick:
                                function() {
                                    window.location.href = "home.html?token=" + token;
                                }
                    };
                },
                closeSurveyMode: function(token) {
                    return {
                        title: "Salir",
                        onclick:
                                function() {
                                    authModal(function() {
                                        window.location.href = "surveys.html?token=" + token;
                                    });
                                }
                    };
                }
            }

        };


        /**
         * Obtiene un parámetro específico de la url actual
         * @param {type} sParam
         * @returns {HomeL#2.Home.getUrlParameter.sParameterName|Boolean}
         */
        this.getUrlParameter = function(sParam) {
            var pageUrl = decodeURIComponent(window.location.search.substring(1)), sURLVariables = pageUrl.split('&'), sParameterName, i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            }
        };

        this.gotToLogin = function() {
            window.location = "login.html";
            ;
        };

        this.goToSurveyInterface = function(token, idSurvey) {
            window.location = "surveyInterface.html?token=" + token + "&idSurvey=" + idSurvey;
            ;
        };

        var authModal = function(onclick) {
            if (typeof onclick === "function")
                onclick();
        };
    };

    return new system();
});