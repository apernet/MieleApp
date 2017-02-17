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
            SurveyBuilder.init({token: token}, survey);

            hideNavBarTitle();

            setTitle(survey.name);

            setWelcomText(survey);          // initial slider

            $(survey.mst_questions).each(function(index) {
                /* add a new slider each three questions */
                if (index % 3 === 0)
                    sliderContainer = getSliderContainer();
                
                SurveyBuilder.addQuestion(this).insertBefore(sliderContainer.find('.navigation-buttons'));

            });

            setFinishText(survey);          // end slider

            slider = initSlider();
        };

        var initSlider = function() {
            var sliderObject = $('#slider').bxSlider({
                mode: "fade",
                speed: 800,
                hideControlOnEnd: true,
                pager: false,
                slideSelector: $(".slider-container"),
                infiniteLoop: false,
                controls: false,
                touchEnabled: false,
                onSlideNext: function($slideElement, oldIndex, newIndex) {
                    showNavBarTitle();
                },
                onSlideAfter: function($slideElement, oldIndex, newIndex) {
                    setSliderNumber();
                }
            });

            $('.button-next').on("click", function() {
                if (questionsCompleted())
                    slider.goToNextSlide();
            });
            
            $('.button-prev').on("click", function() {
                if(slider.getCurrentSlide() > 1)
                    slider.goToPrevSlide();
            });
            
            $('.restart-survey').on("click", function(){
                slider.goToSlide(0);
            });

            return sliderObject;
        };
        
         /**
         * 
         * @param {boolean} addCurrentSlider add slider number container
         * @returns {$}
         */
        var getSliderContainer = function(){
            var sliderContainder = $('<div>', {class: "slider-container"});
                sliderContainder.append(getSliderNumberContainer())
                        .append(navigationButtons());
                
            $('#slider').append(sliderContainder);
            
            return sliderContainder; 
        };
        
        var getSliderNumberContainer = function(){
            return $('<div>', {class: "slider-number-container"});
        };

        var showNavBarTitle = function() {
            $('.navbar').removeClass('message-mode');
        };

        var hideNavBarTitle = function() {
            $('.navbar').addClass('message-mode');
        };

        var setTitle = function(title) {
            $('.survey-title').append(title);
        };

        var setSliderNumber = function() {
            var index = slider.getCurrentSlide();
            var totalSliders = parseInt(slider.getSlideCount()) - 1;
            if(!isNaN(totalSliders) || !isNaN(index))
                if (index > 0)
                    $('.slider-number-container').empty().text(index + "/" + totalSliders);
        };

        var getFooter = function() {
            return $('<div>', {class: "footer-Wrapper"}).append($('<img>', {src: "img/logo-bar.png"}));
        };

        var setWelcomText = function(survey) {
            var content = $('<div>', {class: "message-container slider-container", id: "question_welcome_text", idQuestionType: 0, idQuestion: 0})
                    .append($('<div>', {class: "text-wrapper"}).append(survey.welcome_text))
                    .append(getFooter())
                    .append(startSurvey());

            $('#slider').append(content);
        };

        var setFinishText = function(survey) {
            var content = $('<div>', {class: "message-container slider-container", id: "question_finish_text", idQuestionType: 0, idQuestion: 0})
                    .append($('<div>', {class: "text-wrapper"}).append(survey.finish_text))
                    .append(getFooter())
                    .append(restartSurvey());

            $('#slider').append(content);
        };

        var getSurvey = function() {
            var idSurvey = sys.getUrlParameter("idSurvey");

            return (!parseInt(idSurvey) > 0) ? null : Surveys.getSurvey(token, idSurvey);
        };
        
        var startSurvey = function(){
            var wrapper = $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center"});
            var container = $('<div>', {class:"btn-group"});
            var next = $('<button>', {class: "btn btn-primary btn-lg button-next next-bx"}).append("Empezar");
            
            container.append(next);
            
            return  wrapper.append(container);
        };
        
        var restartSurvey = function(){
            var wrapper = $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center"});
            var container = $('<div>', {class:"btn-group"});
            var next = $('<button>', {class: "btn btn-primary btn-lg restart-survey"}).append("Iniciar nueva encuesta");
            
            container.append(next);
            
            return  wrapper.append(container);
        };

        var navigationButtons = function() {
            var wrapper = $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center navigation-buttons"});
            var container = $('<div>', {class:"btn-group"});
            var next = $('<button>', {class: "btn btn-primary btn-lg button-next next-bx"}).append("Siguiente");
            var prev = $('<button>', {class: "btn btn-primary btn-lg button-prev prev-bx"}).append("Anterior");
            
            wrapper.append(container);
            
            container.append(prev);
            container.append(next);
            
            return wrapper;
        };

        var questionsCompleted = function() {
            var ok = true;


            return ok;
        };

    };

    return new SurveyInterface();
});
