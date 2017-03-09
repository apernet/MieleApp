/*******************************************************************************
 * @description Manage functions for building surveys.
 * @author Daniel Luna   dluna@aper.net
 * 
 * @param {type} $
 * @param {type} Sortable
 * @param {type} QT
 * @param {type} sys
 * @param {type} e
 * @returns {SurveyBuilder|surveyBuilderL#4.SurveyBuilder}
 *******************************************************************************/
define(['jquery', 'system', 'exceptions', 'alerts'], function($, sys, e, alerts) {
    var SurveyBuilder = function() {
        var self = this;
        var token = null;
        var question = null;

        var questionTypes = {
            '1': 'singleAnswer',
            '2': 'multipleAnswerRadio',
            '3': 'multipleAnswerCheck',
            '4': 'approval',
            '5': 'ratingScale',
            '6': 'singleText',
            '7': 'confirmation'
        };

        /**
         * @description Initializes main functions
         * @param {json} settings 
         * settings:{
         *              token: token, 
         *              idSurveyTypeSelect: id select of survey type, 
         *              idSurveyInfo: id form of container survey info, 
         *              idButtonToolbar: "button toolbal container id"
         *          }
         * @returns {undefined}
         */
        this.init = function(settings) {
            token = settings.token;
        };

        /**
         * @description build container of a new question
         * @param {object} question
         * @returns {Number}
         */
        this.addQuestion = function(question) {
            var qcontainer = self.questionContainer(question);

            setQuestion(question, qcontainer);

            return qcontainer;
        };

        /**
         * @description execute function of a selected question.
         * @param {string} question question object
         * @param {object} qcontainer question container is an object wrapper  
         * @returns {undefined}
         */
        var setQuestion = function(question, qcontainer) {
            var questionName = getSurveyTypeSelected(question.idQuestionType);
            self.question[questionName].init(qcontainer, question);

        };

        this.questionContainer = function(question) {
            var content = $('<div>', {class: "active questionContainer list-group col-xs-12 col-sm-12 col-md-12 col-lg-12", id: "question_" + question.id, idQuestionType: question.idQuestionType, idQuestion: question.id}).append();

            return content;
        };

        var getSurveyTypeSelected = function(idQuestionType) {
            return questionTypes[idQuestionType];
        };

        var getAnswersOptions = function(question) {
            return question.cat_question_type.answer_type;
        };

        this. isQuestionCompleted = function(qcontainer, idQuestionType) {
            var questionName = getSurveyTypeSelected(idQuestionType);
            return self.question[questionName].validate(qcontainer);
        };

        /**
         * @description object that contains functions of each type of question
         */
        this.question = {
            /**
             * Added a single question
             * @param {type} qcontainer
             * @returns {undefined}
             */
            singleAnswer: {
                init: function(qcontainer, question) {
                    this.add(qcontainer, question);

                },

                add: function(qcontainer, question) {
                    var self_ = this;
                    var textarea = $('<textarea>', {class: "form-control question", placeholder: "Escriba aquí su respuesta"});
                    var form = $('<div>', {class: "form-group"}).append($('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12"}).append(textarea));
                    qcontainer.append($('<label>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12"}).append(question.text));
                    qcontainer.append(form);

                    /* when press button next in the survey and if the question has error alert this will deactivate it */
                    textarea.keydown(function() {
                        self_.removeAlert(textarea);
                    });
                },

                validate: function(qcontainer) {
                    var form = qcontainer.find('.question').first();
                    form.val($.trim(form.val()));
                    return (form.val().length > 0) ? this.removeAlert(form) : this.addAlert(form);
                },
                addAlert: function(form) {
                    alerts.addFormError(form);
                    return false;
                },
                removeAlert: function(form) {
                    alerts.removeFormError(form);
                    return true;
                }
            },

            /**
             * Multiple answer type
             * @param {type} qcontainer
             * @returns {undefined}
             */
            multipleAnswerRadio: {
                init: function(qcontainer, question) {
                    self.question.multipleAnswerFunct.init(qcontainer, "record", question);
                },
                validate: function(qcontainer) {
                    return self.question.multipleAnswerFunct.validate(qcontainer);
                }
            },

            multipleAnswerCheck: {
                init: function(qcontainer, question) {
                    self.question.multipleAnswerFunct.init(qcontainer, "check", question);
                },
                validate: function(qcontainer) {
                    return self.question.multipleAnswerFunct.validate(qcontainer);
                }
            },

            /**
             * functions of Multiple answers
             */
            multipleAnswerFunct: {
                init: function(qcontainer, iconTypeOfQuestion, question) {
                    var questionWrapper = $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12 question"}).append(question.text);
                    var optionsWrapper = $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12"});

                    qcontainer.append(questionWrapper);
                    optionsWrapper.append(this.setOptions(iconTypeOfQuestion, question));
                    qcontainer.append(optionsWrapper);

                    return true;
                },
                setOptions: function(iconTypeOfQuestion, question) {
                    var self_ = this;
                    var options = question.question_answers;
                    var wrapper = $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12"});

                    $(options).each(function() {
                        var type = (iconTypeOfQuestion === "check") ? "checkbox" : "radio";
                        var option = $('<div>', {class: type});
                        var input = $('<input>', {class: "option", type: type, name: "radio_" + question.id});
                        var label = $('<label>').append(input).append(this.text);

                        wrapper.append(option.append(label));
                        /* when press button next in the survey and if the question has error alert this will deactivate it */
                        $(input).on("click", function() {
                            self_.removeAlert(wrapper);
                        });
                    });

                    return wrapper;
                },
                validate: function(qcontainer) {
                    var status = false;
                    qcontainer.find('.option').each(function() {
                        if ($(this).is(':checked'))
                            status = true;
                    });
                    return (status) ? this.removeAlert(qcontainer) : this.addAlert(qcontainer);
                },
                addAlert: function(qcontainer) {
                    qcontainer.find('.checkbox').each(function() {
                        $(this).addClass('has-error');
                    });
                    qcontainer.find('.radio').each(function() {
                        $(this).addClass('has-error');
                    });
                    return false;
                },
                removeAlert: function(qcontainer) {
                    qcontainer.find('.checkbox').each(function() {
                        $(this).removeClass('has-error');
                    });
                    qcontainer.find('.radio').each(function() {
                        $(this).removeClass('has-error');
                    });
                    return true;
                }
            },

            /**
             * @description this function adds a question type of approval
             */
            approval: {
                init: function(qcontainer, question) {
                    this.add(qcontainer, question);
                },

                add: function(qcontainer, question) {
                    var questionWrapper = $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12 question"}).append(question.text);
                    qcontainer.append(questionWrapper).append(this.getButtonsGroup(question));

                    return true;
                },

                getButtonsGroup: function(question) {
                    var self_ = this;
                    var group = $('<div>', {class: "btn-group", role: "group"});
                    var groupButton = this.getButtonGroupOptions(question);

                    $(groupButton).each(function() {
                        var button = $('<button>', {type: "button", class: "btn btn-default btn-lg", value: this.id}).append(this.name);
                        group.append(button);
                    });

                    $(group).find("button").on("click", function() {
                        /* when press button next in the survey and if the question has error alert this will deactivate it */
                        self_.removeAlert(group);
                        
                        $(group).find("button.active").removeClass("active");
                        $(this).addClass('active');
                    });

                    return $('<div>', {class: "row col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center"}).append(group);
                },

                getButtonGroupOptions: function(question) {
                    return getAnswersOptions(question);
                },

                validate: function(qcontainer) {
                    var status = false;
                    var btngroup = qcontainer.find('.btn-group').first();
                    if (qcontainer.find('.btn.active').length === 1)
                        status = true;

                    return (status) ? this.removeAlert(btngroup) : this.addAlert(btngroup);
                },

                addAlert: function(btngroup) {
                    btngroup.css({"border": "solid 1px red"});
                    return false;
                },
                removeAlert: function(btngroup) {
                    btngroup.css({"border": "none"});
                    return true;
                }
            },

            /**
             * @description this function adds a question type of rating scale 
             */
            ratingScale: {
                init: function(qcontainer, question) {
                    this.add(qcontainer, question);
                },

                add: function(qcontainer, question) {
                    var questionWrapper = $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12 question"}).append(question.text);

                    qcontainer.append(questionWrapper);

                    var ratingForm = $('<input>', {type: "text", value: 0, "data-min": 0, "data-max": 10, "data-step": 1, class: "rating"});

                    qcontainer.append(ratingForm);

                    ratingForm.rating({stars: 10, language: "es", starCaptions: {
                            1: "1",
                            2: "2",
                            3: "3",
                            4: "4",
                            5: "5",
                            6: "6",
                            7: "7",
                            8: "8",
                            9: "9",
                            10: "10"
                    }});

                    return true;
                },

                getGradeSelect: function(qcontainer) {
                    return parseInt(qcontainer.find('input').first().val());
                },

                gradeOptions: function() {
                    var options = [];
                    for (var cont = 3; cont < 11; cont++)
                        options.push({option: cont, value: cont});

                    return options;
                },

                validate: function(qcontainer) {
                    return (this.getGradeSelect(qcontainer) > 0) ? true : false;
                }
            },

            /**
             * @description This function adds a single text
             */
            singleText: {
                init: function(qcontainer, question) {
                    this.add(qcontainer, question);
                },

                add: function(qcontainer, question) {
                    var questionWrapper = $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12 question"}).append(question.text);

                    qcontainer.append(questionWrapper);
                    return true;
                },

                save: function(qcontainer) {
                    return true;
                },
                
                validate: function() {
                    return true;
                }
            },

            /**
             * @description question of confirmation type
             */
            confirmation: {
                init: function(qcontainer, question) {
                    this.add(qcontainer, question);
                },

                add: function(qcontainer, question) {
                    var questionWrapper = $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12 question"}).append(question.text);

                    qcontainer.append(questionWrapper).append(this.getButtonsGroup(question));

                    return true;
                },

                getButtonsGroup: function(question) {
                    var self_ = this;
                    var group = $('<div>', {});
                    
                    $(this.getButtonGroupOptions(question)).each(function() {
                        var button = $('<input>', {type: "radio", value: this.value, name: "radio"});
                        var label = $('<label>').append(button).append(this.text);
                        var div = $('<div>', {class: "radio"}).append(label);
                        
                        group.append(div);
                        
                        /* when press button next in the survey and if the question has error alert this will deactivate it */
                        $(button).on("click", function() {
                            self_.removeAlert(group);
                        });
                    });

                    return $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12"}).append(group);
                },

                getButtonGroupOptions: function(question) {
                    var questionData = getAnswersOptions(question);
                    var options = [];

                    $(questionData).each(function() {
                        options.push({text: this.name, value: this.id});
                    });

                    return options;
                },

                validate: function(qcontainer) {
                    var status = false;
                    
                    qcontainer.find('input[type=radio]').each(function() {
                        if ($(this).is(':checked'))
                            status = true;
                    });
                    
                    return (status) ? this.removeAlert(qcontainer) : this.addAlert(qcontainer);
                },
                
                addAlert: function(qcontainer) {
                    qcontainer.find('.radio').each(function() {
                        $(this).addClass('has-error');
                    });

                    return false;
                },
                
                removeAlert: function(qcontainer) {
                    qcontainer.find('.radio').each(function() {
                        $(this).removeClass('has-error');
                    });

                    return true;
                }
            }
        };
    };

    return new SurveyBuilder();
});