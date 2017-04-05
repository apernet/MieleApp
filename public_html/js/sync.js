define(['jquery', 'database', 'menu', 'system', 'exceptions'], function($, db, menu, system, e) {
    var Sync = function() {
        this.init = function() {
            var token = system.getUrlParameter("token");
            
            $(document).ready(function() {
                initMenu(token);
                $('#sync-now').on("click", function(){
                    $(this).attr("disabled", true);
                    var data = syncNow(token);
                    console.log(data);
                    $(this).attr("disabled", false);
                });
            });

        };

        var initMenu = function(token) {
            menu.init({
                buttonSelector: "menu-toggle",
                pageWrapper: "pageWrapper",
                brandTitle: "Miele",
                options: [
                    menu.option.closeSurveyMode(token),
                    menu.option.closeSessionOption(token),
                    menu.option.sync(token)
                ]
            });
        };
        
        var syncNow = function(token){
            var data = null;
            $.ajax({
                method: "POST",
                async: false,
                cache: false,
                data: {},
                url: system.getSystemPath() + "/sync/?token=" + token,
                success: function(response, textStatus, jqXHR) {
                    if (typeof response !== 'object')
                        e.error("Respuesta inesperada", response);

                    data = response;
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                    e.error(jqXHR.statusText + " - " + jqXHR.status, jqXHR.responseText+"<br>"+errorThrown, function(){
                        system.gotToLogin();
                    });
                }
            });
            return data;
        };
    };

    return new Sync();
});