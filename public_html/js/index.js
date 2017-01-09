
define(['jquery'], function($) {
    var index = function() {
        this.init = function() {
            $(document).ready(function() {
                setTimeout(function() {
                    window.location.href =  "login.html";
                }, 2000);
            });

        };
    };

    return new index();
});