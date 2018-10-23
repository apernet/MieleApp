
define(['jquery'], function($) {
    var index = function() {
        this.init = function() {
            $(document).ready(function() {
                setTimeout(function() {
                    //window.location.href =  "login.html";
                    window.location.href =  "home.html";
                }, 2000);
            });

        };
    };

    return new index();
});