define(['jquery', 'surveys', 'system', 'surveyBuilder', 'jquery.bxslider'], function($, Surveys, sys, SurveyBuilder, bx) {
    var SurveyInterface = function() {
        var token = null;
        this.init = function() {
            token = sys.getUrlParameter("token");
            showSurvey();
        };

        var showSurvey = function() {
            var survey = getSurvey();
            survey = ($.isPlainObject(survey)) ?  null :  survey[0];
            console.log(survey);
            SurveyBuilder.init({token:token}, survey);
            $(survey.mst_questions).each(function(){
                SurveyBuilder.addQuestion(this);
            });
            $('#surveyBuilderContainer').bxSlider({
                mode: "fade",
                speed: 800,
                hideControlOnEnd: true,
                pager: false,
                slideSelector: $(".cuestionContainer"),
                infiniteLoop: false
            });
        };

        var getSurvey = function() {
            var idSurvey = sys.getUrlParameter("idSurvey");
            return Surveys.getSurvey(token, idSurvey);
        };

    };

    return new SurveyInterface();
});
