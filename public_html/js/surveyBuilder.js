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
        var surveyInfoContainer = null;

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
            var questionName = getSurveyTypeSelected(question);
            self.question[questionName].init(qcontainer, question);
            
        };

        this.questionContainer = function(question) {
            var content = $('<div>', {class: "active questionContainer list-group col-xs-12 col-sm-12 col-md-12 col-lg-12", id: "question_"+question.id, idQuestionType: question.idQuestionType, idQuestion: question.id}).append();
            $('#surveyBuilderContainer').append(content);
            return content;
        };

        var getSurveyTypeSelected = function(question) {
            return questionTypes[question.idQuestionType];
        };

        var getAnswersOptions = function(question) {
            return question.cat_question_type.answer_type;
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
                     var textarea = $('<textarea>', {class: "form-control question", placeholder: "Escriba aquí su pregunta"});
                    var form = $('<div>', {class: "form-group"}).append($('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12"}).append(textarea));
                    qcontainer.append($('<label>', {class:"col-xs-12 col-sm-12 col-md-12 col-lg-12"}).append(question.text));
                    qcontainer.append(form);
                },

                save: function(qcontainer) {
                   
                },

                removeAlert: function() {
                    
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
                save: function(qtype, qcontainer) {
                    return self.question.multipleAnswerFunct.save(qtype, qcontainer);
                }
            },

            multipleAnswerCheck: {
                init: function(qcontainer, question) {
                    self.question.multipleAnswerFunct.init(qcontainer, "check", question);
                },
                save: function(qtype, qcontainer) {
                    return self.question.multipleAnswerFunct.save(qtype, qcontainer);
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
                    var options = question.question_answers;
                    var wrapper = $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12"});
                    $(options).each(function(){
                        var type = (iconTypeOfQuestion === "check") ? "checkbox" : "radio";
                        var option = $('<div>', {class: type});
                        var input = $('<input>', {type: type, name:"radio_"+question.id});
                        var label = $('<label>').append(input).append(this.text);
                        wrapper.append(option.append(label));
                    });
                    
                    return wrapper;
                },
                save: function(qcontainer) {
                    
                },

                /**
                 * @description return data object of the question.
                 * @param {type} qtype
                 * @param {type} qcontainer
                 * @returns {surveyBuilderL#12.SurveyBuilder.execute.multipleAnswerFunct.getData.surveyBuilderAnonym$27|Boolean}
                 */
                getData: function(qcontainer) {

                },
                /**
                 * @description Validates main question and each answer option.
                 * @param {type} qcontainer
                 * @returns {Boolean}
                 */
                validate: function(qcontainer) {
                    var status = true;
                    var questionForm = $(qcontainer).find('.question').first();

                    questionForm.val($.trim(questionForm.val()));
                    alerts.removeFormError(questionForm);

                    if ($.trim(questionForm.val()).length === 0) {
                        status = false;
                        alerts.addFormError(questionForm);
                    }

                    if ($(qcontainer).find('input.questionOption').length === 0)
                        status = false;
                    else
                        $(qcontainer).find('input.questionOption').each(function() {
                            var optionForm = $(this);

                            alerts.removeFormError(optionForm);
                            optionForm.val($.trim(optionForm.val()));

                            if (optionForm.val().length === 0) {
                                status = false;
                                alerts.addFormError($(this));
                            }
                        });

                    return status;
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
                    var group = $('<div>', {class: "btn-group", role: "group"});
                    var groupButton = this.getButtonGroupOptions(question);

                    $(groupButton).each(function() {
                        var button = $('<button>', {type: "button", class: "btn btn-default", value: this.id}).append(this.name);
                        group.append(button);
                    });
                    
                    $(group).find("button").on("click", function(){
                        $(group).find("button.active").removeClass("active");
                        $(this).addClass('active');
                    });
                    return $('<div>', {class: "row col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center"}).append(group);
                },

                getButtonGroupOptions: function(question) {
                    return getAnswersOptions(question);
                },
                /**
                 * @description return question data;
                 * @param {type} qtype
                 * @param {type} qcontainer
                 * @returns {unresolved}
                 */
                save: function(qcontainer) {
                    
                },

                removeAlert: function(questionForm) {
                    return alerts.removeFormError(questionForm);
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

                    var label = $('<label>', {class: "col-xs-7 col-sm-9 col-md-9 col-lg-4"}).append("Puntuación Máxima");
                    var gradeForm = this.getGradeSelect();

                    var formGroup = $('<div>', {class: "form-group"})
                            .append(label)
                            .append($('<div>', {class: "col-xs-5 col-sm-3 col-md-3 col-lg-3"}).append(gradeForm));

                    qcontainer.append(formGroup);

                    return true;
                },

                getGradeSelect: function() {
                    var select = $('<select>', {class: "form-control grade"});
                    $(this.gradeOptions()).each(function() {
                        $(select).append($('<option>', {value: this.value}).append(this.option));
                    });
                    return select;
                },

                gradeOptions: function() {
                    var options = [];
                    for (var cont = 3; cont < 11; cont++)
                        options.push({option: cont, value: cont});

                    return options;
                },
                /**
                 * @description return question data;
                 * @param {type} qcontainer
                 * @returns {unresolved}
                 */
                save: function(qcontainer) {
                    
                },

                removeAlert: function(questionForm) {
                    return alerts.removeFormError(questionForm);
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
                    
                },

                removeAlert: function(questionForm) {
                    return alerts.removeFormError(questionForm);
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
                    var group = $('<div>', {});
                    $(this.getButtonGroupOptions(question)).each(function() {
                        var button = $('<input>', {type: "radio", value: this.value, name: "radio"});
                        var label = $('<label>').append(button).append(this.text);
                        var div = $('<div>', {class: "radio"}).append(label);
                        group.append(div);
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

                save: function(qcontainer) {
                    
                },

                removeAlert: function(questionForm) {
                    return alerts.removeFormError(questionForm);
                }
            }
        };
        /**
         * @description functions for storing the currently survey
         * @type type
         */
        this.save = {
            survey: function() {
                var data = (!this.isEmpty()) ? this.getSurveyData() : null;

                return (data !== false) ? this.sendData(data) : null;
            },

            isEmpty: function() {
                return ($('.questionContainer').length > 0) ? false : this.alertOfEmtySurvey();
            },

            /**
             * @description Returns a json object with the information of the new survey.
             * @returns {object} data || null
             *      {
             *          name: name of the survey,
             *          type: type of survey,
             *          anon: is anon,
             *          welcome_text: text,
             *          finish_text: text
             *      }
             */
            getSurveyData: function() {
                var data = null;
                var questionData = this.getQuestionData();

                data = this.getSurveyInfoObject();
                data.questions = questionData;

                return data;
            },

            getSurveyInfoObject: function() {
                var surveyInfoData = this.getSurveyInfoData();
                var surveyInfoObject = {};

                surveyInfoData.push({name: "anon", value: ($('#isAnon').prop("checked")) ? 1 : 0});

                $(surveyInfoData).each(function() {
                    surveyInfoObject[this.name] = this.value;
                });

                return surveyInfoObject;
            },

            getSurveyInfoData: function() {
                return JSON.parse(JSON.stringify(surveyInfoContainer.serializeArray()));
            },

            /**
             * @description process each question for storing in the server
             * @returns {Array}
             */
            getQuestionData: function() {
                var data = [];
                var errors = false;

                $('.questionContainer').each(function() {
                    var idQuestionType = getSurveyTypeSelected($(this).attr('idQuestionType'));
                    var dataQuestion = self.question[idQuestionType].save($(this));

                    ($.isPlainObject(dataQuestion)) ? data.push(dataQuestion) : errors = true;
                });

                return (errors === true) ? null : (data.length > 0) ? data : null;
            },

            /**
             * @description Send the survey data to the server to be stored
             * @param {object} 
             *      
             *  {
             *        survey: array(1) {
             *             [0]=>                    //Question 1
             *                 array(2) {
             *                  ["qtype"]=> string(1) "1"
             *                  ["question"]=> string(7) "fqwfqwr"
             *               },
             *               [1]=>                  //Question 2
             *               array(2) {
             *                  ["qtype"]=>    //Question Type
             *                  string(1) "1" ["question"]=>
             *                  string(7) "fqwfqwr"
             *           } 
             *   }
             * @returns {unresolved}
             */
            sendData: function(data, callbackSuccess) {
                console.log("processData");
                console.log(data);

                return $.ajax({
                    method: "POST",
                    async: false,
                    cache: false,
                    data: data,
                    url: sys.getSystemPath() + "/survey/create/?token=" + token,
                    type: "json",
                    success: function(response, textStatus, jqXHR) {
                        if (typeof callbackSuccess === "function") {
                            callbackSuccess();
                        } else
                        if (parseInt(jqXHR.status) === 200)
                            e.success("Éxito", "Encuesta creada correctamente", function() {
                                sys.goToIndex(token);
                            });
                        else
                            e.warning(jqXHR, textStatus, jqXHR);
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        e.manageError(jqXHR, textStatus, errorThrown);
                        return 0;
                    }
                });
            },

            alertOfEmtySurvey: function() {
                e.warning("Advertencia", "Necesita agregar almenos una pregunta");
            }
        };
    };

    return new SurveyBuilder();
});