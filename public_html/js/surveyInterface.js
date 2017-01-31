define(['jquery', 'surveys', 'system'], function($, Surveys, sys){
    var SurveyInterface = function(){
        var token = null;
        this.init = function(){
            token = sys.getUrlParameter("token");
            showSurvey();
        };
        
        var showSurvey = function(){
            var survey = getSurvey();
        };
        
        var getSurvey = function(){
            var idSurvey = sys.getUrlParameter("idSurvey");
            var survey = Surveys.getSurvey(token, idSurvey);
            console.log(survey);
        };
       
    };
    
    return new SurveyInterface();
});
