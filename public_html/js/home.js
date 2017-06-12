
define(['jquery', 'menu', 'system', 'sync'], function($, menu, system, sync) {
    var Home = function() {
        var token = null;

        this.init = function() {
            setToken();
            buildMenu();
            $(window).on('orientationchange', resizeWrapper);

            $('.container').css({width: $(window).width()});
            $('.productos-content').height($(window).height());
            $('.encuestas-content').height($(window).height());

            $('.option').click(function(e) {
                e.preventDefault();
                if($(this).attr('option') !== undefined)
                    window.location.href =  $(this).attr('option') + ".html?token=" + token;
            });
        };

        var resizeWrapper = function() {
            $('.container').css({width: $(window).width()});
            $('.productos-content').height($(window).height());
            $('.encuestas-content').height($(window).height());
        };
        
        /**
         * Construye el menú de la interfaz actual
         * @returns {undefined}
         */
        var buildMenu = function() {
            $(document).ready(function() {
                menu.init({
                    buttonSelector: "menu-toggle",
                    pageWrapper: "pageWrapper",
                    brandTitle: "Miele",
                    options: [
                        menu.option.sync(token),
                        menu.option.closeSessionOption(token)
                    ]
                });
            });
        };    
        
        var setToken = function() {
            token = system.getUrlParameter("token");
        };        
    };

    return new Home();
});