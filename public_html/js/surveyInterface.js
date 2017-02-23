define(['jquery', 'surveys', 'system', 'surveyBuilder', 'jquery.bxslider', 'menu', 'alerts'], function($, Surveys, sys, SurveyBuilder, bx, menu, alerts) {
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
                        sys.menu.option.closeSurveyMode(token),
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

            (survey.anon) ? null : setSectionAnon();

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
                },
                onSlideBefore: function($slideElement, oldIndex, newIndex) {
//                    $('.slider-container.active-slider').removeClass('active-slider');
                    $($slideElement).attr('index', newIndex);
                }
            });

            $('.button-next').on("click", function() {
                if (questionsCompleted())
                    slider.goToNextSlide();
            });

            $('.button-prev').on("click", function() {
                if (slider.getCurrentSlide() > 1)
                    slider.goToPrevSlide();
            });

            $('.restart-survey').on("click", function() {
                slider.goToSlide(0);
            });

            return sliderObject;
        };

        /**
         * 
         * @param {boolean} addCurrentSlider add slider number container
         * @returns {$}
         */
        var getSliderContainer = function() {
            var sliderContainder = $('<div>', {class: "slider-container"});
            sliderContainder.append(getSliderNumberContainer())
                    .append(navigationButtons());

            $('#slider').append(sliderContainder);

            return sliderContainder;
        };

        var getSliderNumberContainer = function() {
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

            if (!isNaN(totalSliders) || !isNaN(index))
                if (index > 0)
                    $('.slider-number-container').empty().text(index + "/" + totalSliders);
        };

        var getFooter = function() {
            return $('<div>', {class: "footer-Wrapper"}).append($('<img>', {src: "img/logo-bar.png"}));
        };

        var setSectionAnon = function() {
            var content = $('<div>', {class: "slider-container customer-data", id: "anon_section", idQuestionType: 0, idQuestion: 0})
                    .append($('#anonContent').show())
                    .append(startSurvey());
            
            $('#slider').append(content);
            
            $(content).find('input').each(function() {
                $(this).keydown(function() {
                    alerts.removeFormError($(this));
                });
            });
            
            $('#check-privacy').click(function(){
                $(this).closest('div.checkbox').removeClass('has-error');
            });

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

        var startSurvey = function() {
            var wrapper = $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center"});
            var container = $('<div>', {class: "btn-group"});
            var next = $('<button>', {class: "btn btn-primary btn-lg button-next next-bx"}).append("Siguiente");

            container.append(next);

            return  wrapper.append(container);
        };

        var restartSurvey = function() {
            var wrapper = $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center"});
            var container = $('<div>', {class: "btn-group"});
            var next = $('<button>', {class: "btn btn-primary btn-lg restart-survey"}).append("Iniciar nueva encuesta");

            container.append(next);

            return  wrapper.append(container);
        };

        var navigationButtons = function() {
            var wrapper = $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center navigation-buttons"});
            var container = $('<div>', {class: "btn-group"});
            var next = $('<button>', {class: "btn btn-primary btn-lg button-next next-bx"}).append("Siguiente");
            var prev = $('<button>', {class: "btn btn-primary btn-lg button-prev prev-bx"}).append("Anterior");

            wrapper.append(container);

            container.append(prev);
            container.append(next);

            return wrapper;
        };

        /**
         * Check if survey questions are completed
         * @returns {Boolean}
         */
        var questionsCompleted = function() {
            var ok = true;
            var index = slider.getCurrentSlide();

            if (index === 0)
                return true;

            var slide = $('.slider-container[index=' + index + ']');

            if ($(slide).hasClass('customer-data'))
                return checkCustomerData(index);

            $(slide).find('.questionContainer').each(function() {
                var idQuestion = $(this).attr('idquestion');
                var idQuestionType = $(this).attr('idQuestionType');

//                console.log(idQuestion);
//                console.log(idQuestionType);
                var completed = SurveyBuilder.isQuestionCompleted($(this), idQuestionType);
                console.log(completed);
                if (!completed)
                    ok = false;

            });


            return ok;
        };

        /**
         * Check if customer fields data are completed
         * @returns {Boolean}
         */
        var checkCustomerData = function(sliderIndex) {
            var status = true;
            var slide = $('.slider-container[index=' + sliderIndex + ']');
    
            $(slide).find('input').each(function() {
                var input = $(this);
                input.val($.trim(input.val()));

                alerts.removeFormError(input);

                if (input.val().length === 0) {
                    alerts.addFormError(input);
                    status = false;
                }
            });
            
            $('#check-privacy').closest('div.checkbox').removeClass('has-error');
       
            if(!$('#check-privacy').is(':checked')){
                $('#check-privacy').closest('div.checkbox').addClass('has-error');
                status = false;
            }

            return status;
        };

    };

    return new SurveyInterface();
});
