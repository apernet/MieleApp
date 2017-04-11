define(['jquery', 'menu', 'system', 'exceptions', 'jsonstore'], function($, menu, system, e, jsonstore) {
    var Sync = function() {
        this.init = function() {
            var token = system.getUrlParameter("token");
            
            $(document).ready(function() {
                initMenu(token);
                $('#sync-now').on("click", function(){
                    $(this).hide();
                    var data = getData(token);
 
                    if(data !== null)
                        storeLocalData(data);
                    $(this).show();
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
                    menu.option.closeSessionOption(token)
                ]
            });
        };
        
        var getData = function(token){
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
        
        var storeLocalData = function(data){
            var local = jsonstore.sync(data);
        };
    };

    return new Sync();
});