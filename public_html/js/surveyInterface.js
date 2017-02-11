define(['jquery', 'surveys', 'system', 'surveyBuilder', 'jquery.bxslider', 'home'], function($, Surveys, sys, SurveyBuilder, bx, menu) {
    var SurveyInterface = function() {
        var token = null;
        var slider;
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
            
            hideNavBarTitle();
            
            setTitle(survey.name);

            setWelcomText(survey);

            SurveyBuilder.init({token: token}, survey);

            $(survey.mst_questions).each(function(index) {
                /* add a new slider each three questions */
                if (index % 3 === 0)
                    sliderContainer = SurveyBuilder.addQuestion(this);
                else
                    SurveyBuilder.addQuestion(this, sliderContainer);

            });

            setFinishText(survey);
            
            setButtonsNext();
            
            slider = $('#slider').bxSlider({
                mode: "fade",
                speed: 800,
                hideControlOnEnd: true,
                pager: false,
                slideSelector: $(".slider-container"),
                infiniteLoop: false,
                controls: false,
                touchEnabled: false,
                onSlideNext: function($slideElement, oldIndex, newIndex){
                    showNavBarTitle();
                }
            });
        };
        
        /**
         * @description Set button next in each slider
         * @returns {undefined}
         */
        var setButtonsNext = function(){
            $('.slider-container').each(function(){
                $(this).append(getButtonNext("siguientee"));
            });
        };
        
        var showNavBarTitle = function(){
            $('.navbar').removeClass('message-mode');
        };
        
        var hideNavBarTitle = function(){
            $('.navbar').addClass('message-mode');
        };
        
        var setTitle = function(title){
            $('.survey-title').append(title);
            
        };

        var getFooter = function() {
            return $('<div>', {class: "footer-Wrapper"}).append($('<img>', {src: "img/logo-bar.png"}));
        };

        var setWelcomText = function(survey) {
            var content = $('<div>', {class: "message-container", id: "question_welcome_text", idQuestionType: 0, idQuestion: 0})
                    .append($('<div>', {class:"text-wrapper"}).append(survey.welcome_text))
                    .append(getFooter())
                    .append(getButtonNext("Empezar"));

            $('#slider').append(content);
        };

        var setFinishText = function(survey) {
            var content = $('<div>', {class: "message-container", id: "question_finish_text", idQuestionType: 0, idQuestion: 0})
                    .append($('<div>', {class:"text-wrapper"}).append(survey.finish_text))
                    .append(getFooter());

            $('#slider').append(content);
        };

        var getSurvey = function() {
            var idSurvey = sys.getUrlParameter("idSurvey");

            return (!parseInt(idSurvey) > 0) ? null : Surveys.getSurvey(token, idSurvey);
        };

        var getButtonNext = function(text) {
            var button = $('<div>', {class: "text-center next-bx", id: "next-bx"}).append($('<button>', {class: "btn btn-primary btn-lg"}).append(text));
            button.on("click", function() {
                    slider.goToNextSlide();
                    return false;
            });
            return button;
        };

    };

    return new SurveyInterface();
});
