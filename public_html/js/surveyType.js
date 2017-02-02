define(['jquery', 'system', 'exceptions'], function($, sys, e) {
    var SurveyType = function() {
        this.getSurveyTypes = function(token) {
            var surveyType = null;
            $.ajax({
                method: "POST",
                async: false,
                cache: false,
                data: {},
                url: sys.getSystemPath() + "/surveyType/?token=" + token,
                type: "json",
                success: function(response, textStatus, jqXHR) {
                    if (typeof response !== 'object')
                        e.error("e.INTERNAL_SERVER_ERROR", response);

                    surveyType = response;
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    e.manageError(jqXHR, textStatus, errorThrown);
                }
            });
            return surveyType;
        };
    };
    return new SurveyType();
});