define(['jquery', 'menu', 'system', 'exceptions', 'jsonstore'], function($, menu, system, e, jsonstore) {
    var Sync = function() {
        var self = this;
        this.init = function() {
            var token = system.getUrlParameter("token");

            $(document).ready(function() {
                initMenu(token);
                $('#sync-now').on("click", function() {
                    var button = $(this).hide();
                    
                    self.storeLocalData(token, function() {
                        $(button).show();
                    });
                });
            });

        };

        var initMenu = function(token) {
            menu.init({
                buttonSelector: "menu-toggle",
                pageWrapper: "pageWrapper",
                brandTitle: "Miele",
                options: [
                    menu.option.goToHome(token),
                    menu.option.closeSessionOption(token)
                ]
            });
        };

        var getData = function(token) {
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
                    e.error(jqXHR.statusText + " - " + jqXHR.status, jqXHR.responseText + "<br>" + errorThrown, function() {
                        system.gotToLogin();
                    });
                }
            });
            return data;
        };

        this.storeLocalData = function(token, callback) {
            var data = getData(token);
            var local = jsonstore.sync(token, data, callback);
        };
    };

    return new Sync();
});