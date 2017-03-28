define(['jquery', 'surveys', 'system', 'surveyBuilder', 'jquery.bxslider', 'menu', 'alerts', 'notify'], function($, Surveys, sys, SurveyBuilder, bx, menu, alerts, notify) {
    var SurveyInterface = function() {
        var token = null;
        var slider;
        var conditionalQuestions = {};
        this.init = function() {
            token = sys.getUrlParameter("token");

            var survey = getSurvey();

            survey = ($.isPlainObject(survey)) ? null : survey[0];

            buildMenu();

            initSurvey(survey);
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

        var initSurvey = function(survey) {
            console.log(survey);
            setConditionalQuestions(survey.mst_questions);

            SurveyBuilder.init({token: token}, survey);

            hideNavBarTitle();

            setTitle(survey.name);

            setWelcomText(survey);          // initial slider

            (parseInt(survey.anon) === 1) ? null : showSectionAnon();

            setMasterQuestions(survey);

            setFinishText(survey);          // end slider

            slider = initSlider(survey);
        };

        var setMasterQuestions = function(survey) {
            var sliderContainer = getSliderContainer();

            $(survey.mst_questions).each(function(index) {
                if ($(sliderContainer).find('.questionContainer').length === 3) {
                    appendSlider(sliderContainer);
                    sliderContainer = getSliderContainer();
                }

                if (parseInt(this.idParent) === 0) {
                    if (conditionalQuestions[this.id].length > 0) {   // has children
                        if ($(sliderContainer).find('.questionContainer').length > 0)
                            appendSlider(sliderContainer);

                        sliderContainer = getSliderContainer();

                        SurveyBuilder.addQuestion(this, conditionalQuestions[this.id]).insertBefore(sliderContainer.find('.navigation-buttons'));

                        appendSlider(sliderContainer);

                        sliderContainer = getSliderContainer();

                    } else {
                        SurveyBuilder.addQuestion(this).insertBefore(sliderContainer.find('.navigation-buttons'));
                    }
                }

            });

        };

        var setConditionalQuestions = function(questions) {
            $(questions).each(function() {
                if (parseInt(this.idParent) === 0) {
                    conditionalQuestions[this.id] = [];
                } else {
                    if (conditionalQuestions[this.idParent] === undefined)
                        conditionalQuestions[this.idParent] = [];
                    else
                        conditionalQuestions[this.idParent].push(this);
                }
            });
        };

        var initSlider = function(survey) {
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

                    if(slider.getSlideCount() === newIndex+1)
                        storeData(survey);
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

            return sliderObject;
        };

        var storeData = function(survey) {
            SurveyBuilder.store.survey(survey);
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

            return sliderContainder;
        };

        var appendSlider = function(slider) {
            $('#slider').append(slider);
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

        var showSectionAnon = function() {
            var content = $('<div>', {class: "slider-container customer-data", id: "anon_section", idQuestionType: 0, idQuestion: 0})
                    .append($('#anonContent').show())
                    .append(startSurvey());

            $('#slider').append(content);

            $(content).find('input').each(function() {
                $(this).keydown(function() {
                    alerts.removeFormError($(this));
                });
            });

            $('#check-privacy').click(function() {
                $(this).closest('div.checkbox').removeClass('has-error');
            });

        };


        var setWelcomText = function(survey) {
            var content = $('<div>', {class: "message-container slider-container", id: "question_welcome_text", idQuestionType: 0, idQuestion: 0})
                    .append($('<div>', {class: "text-wrapper"}).append(survey.welcome_text))
                    .append(startSurvey())
                    .append(getFooter());

            $('#slider').append(content);
        };

        var setFinishText = function(survey) {
            var content = $('<div>', {class: "message-container slider-container", id: "question_finish_text", idQuestionType: 0, idQuestion: 0})
                    .append($('<div>', {class: "text-wrapper"}).append(survey.finish_text))
                    .append(restartSurveyButton(survey))
                    .append(getFooter());

            $('#slider').append(content);
        };

        var getSurvey = function() {
            var idSurvey = sys.getUrlParameter("idSurvey");

            return (!parseInt(idSurvey) > 0) ? null : Surveys.getSurvey(token, idSurvey);
        };

        var startSurvey = function() {
            var wrapper = $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center button-wrapper"});
            var container = $('<div>', {class: "btn-group"});
            var next = $('<button>', {class: "btn btn-primary btn-lg button-next next-bx"}).append("Siguiente");

            container.append(next);

            return  wrapper.append(container);
        };

        var restartSurveyButton = function(survey) {
            var wrapper = $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center"});
            var container = $('<div>', {class: "btn-group"});
            var next = $('<button>', {class: "btn btn-primary btn-lg restart-survey"}).append("Iniciar nueva encuesta");

            container.append(next);

            next.on("click", function() {
                slider.destroySlider();
                $('#slider').empty();
                initSurvey(survey);
            });

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

                if (!completed) {
                    ok = false;
                    notify.error("Información requerida");
                }

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
            var validate = true;

            $(slide).find('input').each(function() {
                var input = $(this);
                input.val($.trim(input.val()));

                alerts.removeFormError(input);

                if (this.type === "text") {
                    if (input.val().length === 0) {
                        status = false;
                        alerts.addFormError(input);
                    }

                    if ($(this).attr('fieldType') !== undefined) {
                        if (!validation[input.attr('fieldType')](input.val())) {
                            alerts.addFormError(input);
                            validate = false;
                        }
                    }


                }

                if (this.type === "checkbox") {
                    $('#check-privacy').closest('div.checkbox').removeClass('has-error');

                    if (!$(this).is(':checked') & $(this).hasClass('required')) {
                        $(this).closest('div.checkbox').addClass('has-error');
                        status = false;
                    }
                }

            });

            if (!status)
                notify.error("Información requerida.");

            if (!validate) {
                notify.error("Información incorrecta");
                status = false;
            }


            return status;
        };

        validation = {
            telephone: function(telephone) {
                var re = new RegExp("([0-9\ -])");
                return re.test(telephone);
            },

            email: function(email) {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            },

            name: function(name) {
                var re = new RegExp("([A-Za-z])");
                return re.test(String(name));
            }
        };

    };

    return new SurveyInterface();
});
