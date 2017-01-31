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
define(['jquery', 'sortable', 'questionType', 'surveyType', 'system', 'exceptions', 'alerts'], function($, Sortable, QT, ST, sys, e, alerts) {
    var SurveyBuilder = function() {
        var self = this;
        var token = null;
        var questionsType = null;
        var surveyTypeSelect = null;
        var surveyInfoContainer = null;
        var buttonToolbar = null;

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
            setToken(settings);
            surveyTypeSelect = $('#' + settings.idSurveyTypeSelect);
            surveyInfoContainer = $('#'+settings.idSurveyInfo);
            buttonToolbar = $('#'+settings.idButtonToolbar);

            if (buildSurveyBuilderTools())
                setAvailableSurveyTypes();

            $(document).ready(function() {
                buttonToolbar.find('button').on('click', function() {
                    newQuestion($(this));
                });

                $('.home').on('click', function() {
                    sys.goToIndex(token);
                });
            });
        };

        /**
         * @description build button toolbar
         * @returns {undefined}
         */
        var buildSurveyBuilderTools = function() {
            questionsType = getQuestionsType();
            $(questionsType).each(function() {
                var question = this;
                buttonToolbar.append($('<button>', {class: "btn btn-primary " + question.icon, type: question.id, title: question.name, id: question.id}));
            });
            return (questionsType !== undefined && questionsType !== null) ? true : false;
        };

        var setAvailableSurveyTypes = function() {
            var surveyTypes = getSurveyTypes();
            $(surveyTypes).each(function() {
                var option = $('<option>', {id: this.id, value: this.id}).append(this.name);
                surveyTypeSelect.append(option);
            });

        };

        var getQuestionsType = function() {
            return QT.getQuestionType(token);
        };


        var getSurveyTypes = function() {
            return ST.getSurveyTypes(token);
        };

        /**
         * @description build container of a new question
         * @param {object} question
         * @returns {Number}
         */
        var newQuestion = function(question) {
            var questionType = getSurveyTypeSelected($(question).attr('type'));
            removeActiveContainersClass();
            if (questionType === undefined)
                return 0;

            var qcontainer = questionContainer(question);

            setQuestion(questionType, qcontainer);
        };
        /**
         * @description execute function of a selected question.
         * @param {string} qtype index of question type
         * @param {object} qcontainer question container is an object wrapper  
         * @returns {undefined}
         */
        var setQuestion = function(qtype, qcontainer) {
            self.question[qtype].init(qcontainer);
            activeContainerListener();
        };
        /**
         * @description sort questions for dragging
         * @returns {undefined}
         */
        var activeSortable = function() {
            var questionContainerList = document.getElementById('surveyBuilderContainer');

            Sortable.create(questionContainerList, {
                handle: '.glyphicon-move',
                animation: 150
            });
        };

        /**
         * Add border on active questions
         * @returns {undefined}
         */
        var activeContainerListener = function() {
            $('#surveyBuilderContainer').find('input,textarea,checkbox').unbind('focusout').focusout(function() {
                $('.questionContainer').removeClass('active');
            });

            $('#surveyBuilderContainer').find('input,textarea,checkbox').unbind('focus').focus(function() {
                removeActiveContainersClass();
                $(this).closest('.questionContainer').addClass("active");
            });
        };

        var removeActiveContainersClass = function() {
            $('.questionContainer').removeClass('active');
        };

        var questionContainer = function(question) {
            var idQuestionType = question.attr('type');
            var content = $('<div>', {class: "active questionContainer list-group col-xs-12 col-sm-12 col-md-12 col-lg-12", idQuestionType: idQuestionType}).append(titleBarQuestion(question));
            $('#surveyBuilderContainer').append(content);
            activeSortable();
            return content;
        };

        var titleBarQuestion = function(question) {
            var title = $('<div>', {class: "title"})
                    .append($('<button>', {class: "button-title-bar-question close glyphicon glyphicon-trash"}).click(function() {
                        $(this).parents().find('.questionContainer').eq($('.glyphicon-trash').index(this)).remove();
                    }))
                    .append($('<button>', {class: "button-title-bar-question close glyphicon glyphicon-move"}))
                    .append($('<div>', {class: "question-title"}).append(question.attr('title')));
            return title;
        };

        var getSurveyTypeSelected = function(questionTypeSelected) {
            return questionTypes[questionTypeSelected];
        };

        var getQuestionTypeData = function(idQuestion) {
            var data = null;
            $(questionsType).each(function() {
                if (parseInt(idQuestion) === parseInt(this.id))
                    return data = this;
            });

            return data;
        };

        var getAnswersOptions = function(idQuestion) {
            var questionData = getQuestionTypeData(idQuestion);
            return (typeof questionData.answer_type !== undefined) ? questionData.answer_type : null;
        };

        var setToken = function(settings) {
            token = settings.token;
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
                init: function(qcontainer) {
                    this.add(qcontainer).focus();
                },

                add: function(qcontainer) {
                    var textarea = $('<textarea>', {class: "form-control question", placeholder: "Escriba aquí su pregunta"});
                    var form = $('<div>', {class: "form-group"}).append($('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12"}).append(textarea));

                    qcontainer.append(form);

                    return textarea;
                },

                /**
                 * @description return question data;
                 * @param {type} qcontainer
                 * @returns {unresolved}
                 */
                save: function(qcontainer) {
                    var questionForm = $(qcontainer).find('.question').first();
                    var idQuestionType = $(qcontainer).attr("idQuestionType");
                    this.removeAlert(questionForm);

                    return ($.trim($(questionForm).val()).length === 0) ? alerts.addFormError(questionForm) : {text: questionForm.val(), idQuestionType: idQuestionType};
                },

                removeAlert: function(questionForm) {
                    return alerts.removeFormError(questionForm);
                }
            },

            /**
             * Multiple answer type
             * @param {type} qcontainer
             * @returns {undefined}
             */
            multipleAnswerRadio: {
                init: function(qcontainer) {
                    self.question.multipleAnswerFunct.init(qcontainer, "record").focus();
                },
                save: function(qtype, qcontainer) {
                    return self.question.multipleAnswerFunct.save(qtype, qcontainer);
                }
            },

            multipleAnswerCheck: {
                init: function(qcontainer) {
                    self.question.multipleAnswerFunct.init(qcontainer, "check").focus();
                },
                save: function(qtype, qcontainer) {
                    return self.question.multipleAnswerFunct.save(qtype, qcontainer);
                }
            },

            /**
             * functions of Multiple answers
             */
            multipleAnswerFunct: {
                init: function(qcontainer, iconTypeOfQuestion) {
                    var self = this;
                    var textarea = $('<textarea>', {class: "form-control question", type: "text", placeholder: "Escriba aquí su pregunta"});
                    var form = $('<div>', {class: "form-group"}).append($('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12"}).append(textarea));
                    var optionsWrapper = $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12"});
                    var buttonPlus = $('<button>', {class: "btn btn-success glyphicon glyphicon-plus"});
                    var buttonPlusWrapper = $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12"}).append(buttonPlus);

                    buttonPlus.click(function() {
                        self.addForm(optionsWrapper, iconTypeOfQuestion).focus();
                    });

                    qcontainer.append($('<div>', {class: "form-group col-xs-12 col-sm-12 col-md-12 col-lg-12"}).append(form));
                    qcontainer.append(optionsWrapper);
                    qcontainer.append(buttonPlusWrapper);

                    this.addForm(optionsWrapper, iconTypeOfQuestion);

                    return textarea;
                },

                /**
                 * @description add an answer option to the question
                 * @param {type} optionsWrapper
                 * @param {string} iconTypeOfQuestion 
                 * @returns {$}
                 */
                addForm: function(optionsWrapper, iconTypeOfQuestion) {
                    var wrapperForm = $('<div>', {class: "rowOption col-xs-12 col-sm-12 col-md-12 col-lg-12"});
                    var formGroup = $('<div>', {class: "input-group form-group"});
                    var newOptionForm = $('<input>', {class: "questionOption form-control", type: "text", placeholder: "Escriba una respuesta.."});
                    var buttonRemoveForm = $('<button>', {class: "btn btn-warning", type: "button"}).append($('<spam>', {class: "glyphicon glyphicon-remove"}));
                    var buttonTypeQuestionIcon = $('<button>', {class: "btn btn-warning", type: "button"}).append($('<spam>', {class: "glyphicon glyphicon-" + iconTypeOfQuestion}));

                    formGroup.
                            append($('<div>', {class: "input-group-btn"}).append(buttonTypeQuestionIcon))
                            .append(newOptionForm).append($('<div>', {class: "input-group-btn"})
                            .append(buttonRemoveForm));

                    wrapperForm.append(formGroup);
                    optionsWrapper.append(wrapperForm);

                    activeContainerListener();

                    buttonRemoveForm.click(function() {
                        if (optionsWrapper.find('.questionOption').length > 1)
                            wrapperForm.remove();
                    });

                    return newOptionForm;
                },

                save: function(qcontainer) {
                    return this.getData(qcontainer);
                },

                /**
                 * @description return data object of the question.
                 * @param {type} qtype
                 * @param {type} qcontainer
                 * @returns {surveyBuilderL#12.SurveyBuilder.execute.multipleAnswerFunct.getData.surveyBuilderAnonym$27|Boolean}
                 */
                getData: function(qcontainer) {
                    if (!this.validate(qcontainer))
                        return null;

                    var idQuestionType = $(qcontainer).attr('idQuestionType');
                    var questionForm = $(qcontainer).find('.question').first();
                    var data = {text: questionForm.val(), idQuestionType: idQuestionType, answers: []};

                    $(qcontainer).find('input.questionOption').each(function() {
                        var optionForm = $(this);
                        data.answers.push({text: optionForm.val()});
                    });

                    return data;
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
                init: function(qcontainer) {
                    this.add(qcontainer).focus();
                },

                add: function(qcontainer) {
                    var textarea = $('<textarea>', {class: "form-control question", placeholder: "Escriba aquí su pregunta"});
                    var form = $('<div>', {class: "row form-group"})
                            .append($('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12"}).append(textarea));

                    qcontainer.append(form).append(this.getButtonsGroup(qcontainer));

                    return textarea;
                },

                getButtonsGroup: function(qcontainer) {
                    var group = $('<div>', {class: "btn-group", role: "group"});
                    var idQuestionType = $(qcontainer).attr('idQuestionType');
                    var groupButton = this.getButtonGroupOptions(idQuestionType);

                    $(groupButton).each(function() {
                        var button = $('<button>', {type: "button", class: "btn btn-default", value: this.id}).append(this.name);
                        group.append(button);
                    });
                    return $('<div>', {class: "row col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center"}).append(group);
                },

                getButtonGroupOptions: function(idQuestion) {
                    return getAnswersOptions(idQuestion);
                },
                /**
                 * @description return question data;
                 * @param {type} qtype
                 * @param {type} qcontainer
                 * @returns {unresolved}
                 */
                save: function(qcontainer) {
                    var questionForm = $(qcontainer).find('.question').first();
                    var idQuestionType = $(qcontainer).attr('idQuestionType');
                    questionForm.val($.trim(questionForm.val()));
                    this.removeAlert(questionForm);
                    return ($(questionForm).val().length === 0) ? alerts.addFormError(questionForm) : {text: questionForm.val(), idQuestionType: idQuestionType};
                },

                removeAlert: function(questionForm) {
                    return alerts.removeFormError(questionForm);
                }
            },

            /**
             * @description this function adds a question type of rating scale 
             */
            ratingScale: {
                init: function(qcontainer) {
                    this.add(qcontainer).focus();
                },

                add: function(qcontainer) {
                    var textarea = $('<textarea>', {class: "form-control question", placeholder: "Escriba aquí su pregunta"});
                    var formGroup = $('<div>', {class: "row form-group"})
                            .append($('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12"}).append(textarea));

                    qcontainer.append(formGroup);

                    var label = $('<label>', {class: "col-xs-7 col-sm-9 col-md-9 col-lg-4"}).append("Puntuación Máxima");
                    var gradeForm = this.getGradeSelect();

                    formGroup = $('<div>', {class: "row form-group"})
                            .append(label)
                            .append($('<div>', {class: "col-xs-5 col-sm-3 col-md-3 col-lg-3"}).append(gradeForm));

                    qcontainer.append(formGroup);

                    return textarea;
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
                    var questionForm = $(qcontainer).find('.question').first();
                    var grade = $(qcontainer).find('select').first();
                    var idQuestionType = $(qcontainer).attr('idQuestionType');
                    questionForm.val($.trim(questionForm.val()));
                    this.removeAlert(questionForm);
                    return (parseInt(grade.val()) > 0) ?
                            ((questionForm.val().length === 0) ? alerts.addFormError(questionForm) : {text: questionForm.val(), idQuestionType: idQuestionType})
                            : alerts.addFormError(grade);
                },

                removeAlert: function(questionForm) {
                    return alerts.removeFormError(questionForm);
                }
            },

            /**
             * @description This function adds a single text
             */
            singleText: {
                init: function(qcontainer) {
                    this.add(qcontainer).focus();
                },

                add: function(qcontainer) {
                    var textarea = $('<textarea>', {class: "form-control question", placeholder: "Escriba aquí su pregunta"});
                    var formGroup = $('<div>', {class: "row form-group"})
                            .append($('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12"}).append(textarea));

                    qcontainer.append(formGroup);
                    return textarea;
                },

                save: function(qcontainer) {
                    var questionForm = $(qcontainer).find('.question').first();
                    var idQuestionType = $(qcontainer).attr('idQuestionType');

                    questionForm.val($.trim(questionForm.val()));
                    this.removeAlert(questionForm);

                    return (questionForm.val().length === 0) ? alerts.addFormError(questionForm) : {text: questionForm.val(), idQuestionType: idQuestionType};
                },

                removeAlert: function(questionForm) {
                    return alerts.removeFormError(questionForm);
                }
            },

            /**
             * @description question of confirmation type
             */
            confirmation: {
                init: function(qcontainer) {
                    this.add(qcontainer).focus();
                },

                add: function(qcontainer) {
                    var textarea = $('<textarea>', {class: "form-control question", placeholder: "Escriba aquí su pregunta"});
                    var formGroup = $('<div>', {class: "row form-group"})
                            .append($('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12"}).append(textarea));

                    qcontainer.append(formGroup).append(this.getButtonsGroup(qcontainer));

                    return textarea;
                },

                getButtonsGroup: function(qcontainer) {
                    var group = $('<div>', {});
                    var idQuestionType = qcontainer.attr('idQuestionType');
                    $(this.getButtonGroupOptions(idQuestionType)).each(function() {
                        var button = $('<input>', {type: "radio", value: this.value, name: "radio"});
                        var label = $('<label>').append(button).append(this.text);
                        var div = $('<div>', {class: "radio"}).append(label);
                        group.append(div);
                    });

                    return $('<div>', {class: "col-xs-12 col-sm-12 col-md-12 col-lg-12"}).append(group);
                },

                getButtonGroupOptions: function(idQuestion) {
                    var questionData = getAnswersOptions(idQuestion);
                    var options = [];
                    $(questionData).each(function() {
                        options.push({text: this.name, value: this.id});
                    });
                    return options;
                },

                save: function(qcontainer) {
                    var questionForm = $(qcontainer).find('.question').first();
                    var idQuestionType = $(qcontainer).attr('idQuestionType');
                    questionForm.val($.trim(questionForm.val()));
                    this.removeAlert(questionForm);

                    return (questionForm.val().length === 0) ? alerts.addFormError(questionForm) : {text: questionForm.val(), idQuestionType: idQuestionType};
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
                var validatedSurveyInfo = this.validateSurveyInfoData();

                if (!$.isArray(questionData) || !validatedSurveyInfo)
                    return false;

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

            validateSurveyInfoData: function() {
                var status = true;

                surveyInfoContainer.find('.required').each(function() {
                    alerts.removeFormError($(this));
                    $(this).val($.trim($(this).val()));

                    if ($(this).val().length === 0) {
                        status = false;
                        alerts.addFormError($(this));
                    }
                });

                if (!parseInt(surveyTypeSelect.val()) > 0) {
                    status = false;
                    alerts.addFormError(surveyTypeSelect);

                }

                return status;
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