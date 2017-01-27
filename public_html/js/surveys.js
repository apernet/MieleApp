
define(['jquery', 'system', 'menu', 'exceptions'], function($, system, menu, e) {
    var Survey = function() {
        var self = this;
        var token = null;
        this.init = function() {
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
                    system.menu.option.goToHome(token),
                    system.menu.option.closeSessionOption(token)
                ]
            });
        };

        var buildSurveyBoxes = function() {
            var surveyType = self.getSurveysTypes(token);
            $(surveyType).each(function() {
                if (typeof this.id === undefined || typeof this.name === undefined || parseInt(this.status) !== 1)
                    return true;    /* skip */
                $('#boxContent').append(buildBox(this));
            });
        };

        var buildBox = function(survey) {
            var surveyTypeData = (survey.survey_type === undefined) ? {} : survey.survey_type[0];

            var type = $('<div>', {class: "survey-type-title"}).append(surveyTypeData.name);
            var name = $('<div>', {class: "survey-title"}).css({"background-color": surveyTypeData.color}).append(survey.name);
            var icon = $('<div>', {class: "surveyType-icon"}).append($('<img>', {src: surveyTypeData.icon}));
            var button = $('<div>', {class: "button-play"}).append($('<img>', {src: "img/play-button.png"}));
            var box = $('<div>', {class: "box"}).append(type).append(icon).append(button).append(name);

            return $('<div>', {class: "col-sm-4 box-content", surveyName: survey.name}).append(box);
        };
        
        /**
         * 
         * @param {type} token
         * @returns {response}
         */
        this.getSurveysTypes = function(token) {
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

        var getToken = function() {
            return token;
        };
    };

    return new Survey();
});