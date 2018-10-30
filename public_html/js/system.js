
define(['jquery', 'exceptions'], function($, e) {
    var system = function() {
        var self = this;

        var port = 8000;

        this.SERVER = "http://159.203.165.60:" + port;
        
        this.getApiPath = function() {
            return "/api/v1";
        };

        this.getSystemPath = function() {
            return self.SERVER + self.getApiPath();
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

        this.goToSublines = function(token) {
            window.location = "sublines.html?token=" + token;
            ;  
        };

        this.goToProducts = function(token) {
            window.location = "products.html?token=" + token;
            ;  
        };

        this.goToProductDesc = function(token) {
            window.location = "productDesc.html?token=" + token;
            ;  
        };

        var authModal = function(onclick) {
            if (typeof onclick === "function")
                onclick();
        };        
    };

    return new system();
});