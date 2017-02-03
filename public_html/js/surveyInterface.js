define(['jquery', 'surveys', 'system', 'surveyBuilder', 'jquery.bxslider', 'home'], function($, Surveys, sys, SurveyBuilder, bx, menu) {
    var SurveyInterface = function() {
        var token = null;
        this.init = function() {
            token = sys.getUrlParameter("token");
            buildMenu();
            showSurvey();
        };

        var buildMenu = function() {
            $(document).ready(function() {
                menu.init({
                    buttonSelector: "menu-toggle",
                    pageWrapper: "pageWrapper",
                    brandTitle: "Miele",
                    options: [
                        sys.menu.option.closeSessionOption(token)
                    ]
                });
            });
        };

        var showSurvey = function() {
            var survey = getSurvey();
            survey = ($.isPlainObject(survey)) ? null : survey[0];
            setWelcomText(survey);
            console.log(survey);
            SurveyBuilder.init({token: token}, survey);
            $(survey.mst_questions).each(function() {
                SurveyBuilder.addQuestion(this);
            });
            setFinishText(survey);
            $('#surveyBuilderContainer').bxSlider({
                mode: "fade",
                speed: 800,
                hideControlOnEnd: true,
                pager: false,
                slideSelector: $(".cuestionContainer"),
                infiniteLoop: false
            });
        };

        var setWelcomText = function(survey) {
            var content = $('<div>', {class: "active questionContainer list-group col-xs-12 col-sm-12 col-md-12 col-lg-12", id: "question_welcome_text", idQuestionType: 0, idQuestion: 0}).append(survey.welcome_text);
            $('#surveyBuilderContainer').append(content);
        };

        var setFinishText = function(survey) {
            var content = $('<div>', {class: "active questionContainer list-group col-xs-12 col-sm-12 col-md-12 col-lg-12", id: "question_welcome_text", idQuestionType: 0, idQuestion: 0}).append(survey.finish_text);
            $('#surveyBuilderContainer').append(content);
        };

        var getSurvey = function() {
            var idSurvey = sys.getUrlParameter("idSurvey");
            return Surveys.getSurvey(token, idSurvey);
        };

    };

    return new SurveyInterface();
});
