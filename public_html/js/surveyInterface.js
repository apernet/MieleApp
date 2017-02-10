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
            var sliderContainer;

            survey = ($.isPlainObject(survey)) ? null : survey[0];
            console.log(survey);

            setWelcomText(survey);

            SurveyBuilder.init({token: token}, survey);

            $(survey.mst_questions).each(function(index) {
                if (index % 3 === 0)
                    console.log(index);
                /* add a new slider each three questions */
                if (index % 3 === 0)
                    sliderContainer = SurveyBuilder.addQuestion(this);
                else
                    SurveyBuilder.addQuestion(this, sliderContainer);

            });

            setFinishText(survey);

            $('#slider').bxSlider({
                mode: "fade",
                speed: 800,
                hideControlOnEnd: true,
                pager: false,
                slideSelector: $(".slider-container"),
                infiniteLoop: false
            });
        };

        var getFooter = function() {
            return $('<div>', {class: "footer-Wrapper"}).append($('<img>', {src: "img/logo-bar.png"}));
        };

        var setWelcomText = function(survey) {
            var content = $('<div>', {class: "slider-container message-container", id: "question_welcome_text", idQuestionType: 0, idQuestion: 0})
                    .append(survey.welcome_text)
                    .append(getFooter());

            $('#slider').append(content);
        };

        var setFinishText = function(survey) {
            var content = $('<div>', {class: "slider-container message-container ", id: "question_welcome_text", idQuestionType: 0, idQuestion: 0})
                    .append(survey.finish_text)
                    .append(getFooter());

            $('#slider').append(content);
        };

        var getSurvey = function() {
            var idSurvey = sys.getUrlParameter("idSurvey");

            return (!parseInt(idSurvey) > 0) ? null : Surveys.getSurvey(token, idSurvey);
        };

    };

    return new SurveyInterface();
});
