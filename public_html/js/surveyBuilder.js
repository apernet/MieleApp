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
define(['jquery', 'system', 'exceptions', 'alerts', 'notify'], function($, sys, e, alerts, notify) {
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
        this.addQuestion = function(question, conditionalQuestions = null) {
            var qcontainer = self.questionContainer(question);

            setQuestion(question, qcontainer, conditionalQuestions);

            return qcontainer;
        };

        /**
         * @description execute function of a selected question.
         * @param {string} question question object
         * @param {object} qcontainer question container is an object wrapper  
         * @returns {undefined}
         */
        var setQuestion = function(question, qcontainer, conditionalQuestions) {
            var questionName = getSurveyTypeSelected(question.idQuestionType);
            self.question[questionName].init(qcontainer, question, conditionalQuestions);

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
        
        var getIdQuestion = function(qcontainer){
            return (qcontainer.attr('idQuestion') !== undefined) ? qcontainer.attr('idQuestion') : 0;
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
                },
                getData: function(qcontainer){
                    var textAnswer = ($(qcontainer).find('textarea').length > 0) ? $(qcontainer).find('textarea').first().val() : null;
                    return [{
                        idQuestion: getIdQuestion(qcontainer), 
                        answer: textAnswer
                    }];
                }
            },

            /**
             * Multiple answer type
             * @param {type} qcontainer
             * @returns {undefined}
             */
            multipleAnswerRadio: {
                init: function(qcontainer, question, conditionalQuestions) {
                    self.question.multipleAnswerFunct.init(qcontainer, "record", question, conditionalQuestions);
                },
                validate: function(qcontainer) {
                    return self.question.multipleAnswerFunct.validate(qcontainer);
                },

                getData: function(qcontainer) {
                    var data = [];

                    $(qcontainer).find('input[type=radio]').each(function() {
                        if ($(this).is(":checked")) {
                            data.push({
                                idQuestion: getIdQuestion(qcontainer),
                                answer: $(this).closest('label').text(),
                                idQuestionAnswer: this.id
                            });
                        }
                    });

                    return data;
                }
            },

            multipleAnswerCheck: {
                init: function(qcontainer, question) {
                    self.question.multipleAnswerFunct.init(qcontainer, "check", question);
                },
                validate: function(qcontainer) {
                    return self.question.multipleAnswerFunct.validate(qcontainer);
                },
                     
                getData: function(qcontainer) {
                    var data = [];
                    
                    $(qcontainer).find('input[type=checkbox]').each(function() {
                        if ($(this).is(":checked")){
                            data.push({
                                idQuestion: getIdQuestion(qcontainer),
                                answer: $(this).closest('label').text(),
                                idQuestionAnswer: this.id
                            });
                        }
                    });
                    
                    return data;
                }
            },

            /**
             * functions of Multiple answers
             */
            multipleAnswerFunct: {
                init: function(qcontainer, iconTypeOfQuestion, question, conditionalQuestions = null) {
                    var label = $('<label>').append(question.text);
                    var questionWrapper = $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12 question"}).append(label);
                    var optionsWrapper = $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12"});

                    qcontainer.append(questionWrapper);
                    optionsWrapper.append(this.setOptions(qcontainer, iconTypeOfQuestion, question, conditionalQuestions));
                    qcontainer.append(optionsWrapper);

                    return true;
                },
                setOptions: function(qcontainer, iconTypeOfQuestion, question, conditionalQuestions = null) {
                    var self_ = this;
                    var options = question.question_answers;
                    var wrapper = $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12"});
                    
                    $(options).each(function() {
                        var opt = this;
                        var type = (iconTypeOfQuestion === "check") ? "checkbox" : "radio";
                        var option = $('<div>', {class: type});
                        var input = $('<input>', {class: "option", type: type, id: this.id, name: "radio_" + question.id});
                        var label = $('<label>').append(input).append(this.text);

                        wrapper.append(option.append(label));
                        /* when press button next in the survey and if the question has error alert this will deactivate it */
                        $(input).on("click", function() {
                            self_.removeAlert(wrapper);
 
                            $(conditionalQuestions).each(function(){                                
                                var conditionalQcontainer = self.addQuestion(this);
                                                                
                                if(parseInt(this.idParent) === parseInt(question.id)){
                                    if(parseInt(opt.id) === parseInt(this.answer)){
                                        if($('#question_'+this.id).length === 0)
                                            conditionalQcontainer.insertBefore($(qcontainer).closest('.slider-container').find('.navigation-buttons'));
                                    }else
                                        $('#question_'+this.id).remove();
                                }
                            });
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
                    var label = $('<label>').append(question.text);
                    var questionWrapper = $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12 question"}).append(label);
                    qcontainer.append(questionWrapper).append(this.getButtonsGroup(question));

                    return true;
                },

                getButtonsGroup: function(question) {
                    var self_ = this;
                    var group = $('<div>', {class: "btn-group", role: "group"});
                    var groupButton = this.getButtonGroupOptions(question);

                    $(groupButton).each(function() {
                        var button = $('<button>', {type: "button", class: "btn btn-default btn-lg", id:this.id, value: this.id}).append(this.name);
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
                },
                getData: function(qcontainer){
                    return {
                        idQuestion: getIdQuestion(qcontainer),
                        answer: (qcontainer.find('.btn.active').length === 1) ? qcontainer.find('.btn.active').first().text() : "",
                        idAnswerType: (qcontainer.find('.btn.active').length === 1) ? qcontainer.find('.btn.active').first().attr('id') : 0
                    };
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
                    var label = $('<label>').append(question.text);
                    var questionWrapper = $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12 question"}).append(label);
                    var rate = (question.question_answers !== undefined & question.question_answers[0] !== undefined) ? question.question_answers[0].text : 10;
                    qcontainer.append(questionWrapper);

                    var ratingForm = $('<input>', {type: "text", value: 0, "data-min": 0, "data-max": 10, "data-step": 1, class: "rating"});

                    qcontainer.append(ratingForm);

                    ratingForm.rating({stars: rate, language: "es", starCaptions: {
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
                },
                /*
                        idQuestion: value,
                        answer: value,
                        idQuestionAnswer: idOption,
                        idAnswerType: idAnswerOption,
                     */
                getData: function(qcontainer){
                    return {
                        idQuestion: getIdQuestion(qcontainer),
                        answer: (qcontainer.find('input.rating').length === 1) ? qcontainer.find('input.rating').first().val() : ""
                    };
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
                },
                getData: function(qcontainer){
                    return {
                        
                    };
                }
            },

            /**
             * @description question of confirmation type
             */
            confirmation: {
                init: function(qcontainer, question, conditionalQuestions = null) {
                    this.add(qcontainer, question, conditionalQuestions);
                },

                add: function(qcontainer, question, conditionalQuestions) {
                    var label = $('<label>').append(question.text);
                    var questionWrapper = $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12 question"}).append(label);

                    qcontainer.append(questionWrapper).append(this.getButtonsGroup(qcontainer, question, conditionalQuestions));

                    return true;
                },

                getButtonsGroup: function(qcontainer, question, conditionalQuestions) {
                    var self_ = this;
                    var group = $('<div>', {});
                    
                    $(this.getButtonGroupOptions(question)).each(function() {
                        var option = this;
                        var button = $('<input>', {type: "radio", idAnswerType: option.idAnswerType, answer:option.text, value: this.value, name: "radio_"+question.id});
                        var label = $('<label>').append(button).append(this.text);
                        var div = $('<div>', {class: "radio"}).append(label);
                        
                        group.append(div);
                        
                        /* when press button next in the survey and if the question has error alert this will deactivate it */
                        $(button).on("click", function() {
                            self_.removeAlert(group);

                            $(conditionalQuestions).each(function(){                                                                
                                var conditionalQcontainer = self.addQuestion(this);
                                
                                if(parseInt(this.idParent) === parseInt(question.id)){
                                    if(option.text === this.answer){
                                        if($('#question_'+this.id).length === 0)
                                            conditionalQcontainer.insertBefore($(qcontainer).closest('.slider-container').find('.navigation-buttons'));
                                    }else
                                        $('#question_'+this.id).remove();
                                }
                            });
                        });
                    });

                    return $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12"}).append(group);
                },

                getButtonGroupOptions: function(question) {
                    var questionData = getAnswersOptions(question);
                    var options = [];

                    $(questionData).each(function() {
                        options.push({text: this.name, value: this.id, idAnswerType: this.id});
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
                },
                
                getData: function(qcontainer){
                    return {
                        idQuestion: getIdQuestion(qcontainer),
                        answer: (qcontainer.find('input[type=radio]:checked').length === 1) ? qcontainer.find('input[type=radio]:checked').first().attr('answer') : 0,
                        idAnswerType: (qcontainer.find('input[type=radio]:checked').length === 1) ? qcontainer.find('input[type=radio]:checked').first().attr('idAnswerType') : 0
                    };
                }
            }
        };
        
        this.store =  {
            /**
            {
                idQuestion: value,
                answer: value,
                idQuestionAnswer: idOption,
                idAnswerType: idAnswerOption,
            }
             * @returns {object}
             */
            survey: function(survey) {
                var questionsData = this.getQuestionsData();
                var surveySubjectData = this.getSurveySubjectData();
                var surveyAnswer = {id: survey.id, surveySubjectData: surveySubjectData, questionData:questionsData};
                this.sendData(surveyAnswer);
                
            },
            getQuestionsData: function(){
                var data = [];
                $('.questionContainer').each(function() {
                    var qcontainer = $(this);
                    if($(qcontainer).attr('idQuestionType') === undefined)
                        return true;
                    
                    var questionName = getSurveyTypeSelected($(qcontainer).attr('idQuestionType'));
                    var answerData = self.question[questionName].getData($(this));
                    $(answerData).each(function(){
                        data.push(this);
                    });
                });
                
                return data;
            },
            getSurveySubjectData: function(){
                var data = {};
                $("#form-anon").serializeArray().map(function(x){
                    console.log(x);
                    data[x.name] = x.value;
                }); 
                return data;
            },
            sendData: function(data) {
                var status = false;
                console.log(data);

                $.ajax({
                    method: "POST",
                    async: false,
                    cache: false,
                    data: data,
                    url: sys.getSystemPath() + "/surveyanswer/create/?token=" + token,
                    type: "json",
                    success: function(response, textStatus, jqXHR) {
                        console.log(response);
                        if (typeof response !== 'object')
                            e.error("e.INTERNAL_SERVER_ERROR", response);
                        if(response.status)
                            status = true;
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        e.manageError(jqXHR, textStatus, errorThrown);
                    }
                });
                
                return status;
            }
        };
    };

    return new SurveyBuilder();
});