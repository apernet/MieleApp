define(['jquery', 'exceptions', 'system'], function($, e, system){
    var QuestionType = function(){
        this.getQuestionType = function(token){
            var questionsType = null;
            $.ajax({
                method: "POST",
                async: false,
                cache: false,
                data: {},
                url: system.getSystemPath() + "/questionType/?token=" + token,
                type:"json",
                success: function(response, textStatus, jqXHR) {
                    if (typeof response !== 'object')
                        e.error("e.INTERNAL_SERVER_ERROR", response);

                    questionsType = response;
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    e.manageError(jqXHR, textStatus, errorThrown);
                }
            });
            return questionsType;
        };
    };
    
    return new QuestionType();
});