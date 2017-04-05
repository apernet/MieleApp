
define(['jquery', 'exceptions', 'system'], function($, e, system) {
    var Menu = function() {
        var urlBase = document.location.origin;
        var options = {};
        /**
         * 
         * @param {Object} config  
         *      buttonSelector
         * @returns {undefined}
         */

        this.init = function(config) {
            options = config;
            options.pageWrapper = $('#' + config.pageWrapper);
            options.togleButton = $('#' + config.buttonSelector);
            options.pageWrapper.addClass('menu-wrapper');
            buildContainers();
            setOptions();
            setButtonAction();
        };
        this.option = {
            sync: function(token) {
                return {
                    title: "Sincronizar",
                    onclick:
                            function() {
                                window.location.href = "sync.html?token=" + token;
                            }
                };
            },
            /**
             * 
             * @param {type} token
             * @returns {systemL#2.system.menu.option.closeSessionOption.systemAnonym$1}
             */
            closeSessionOption: function(token) {
                var url = system.SERVER + system.getApiPath() + "/auth/invalidate";
                return {
                    title: "Cerrar Sesión",
                    onclick: {
                        ajax: {
                            url: url,
                            params: {"token": token},
                            method: "POST",
                            async: false,
                            success: function(response, textStatus, jqXHR) {
                                if (typeof response !== "object")
                                    e.error(response);
                                if (response.status)
                                    window.location.href = "login.html";
                                else
                                    e.error("Error", response.message);
                            }
                        }
                    }
                };
            },
            goToHome: function(token) {
                return {
                    title: "Home",
                    onclick:
                            function() {
                                window.location.href = "home.html?token=" + token;
                            }
                };
            },
            closeSurveyMode: function(token) {
                return {
                    title: "Salir",
                    onclick:
                            function() {
                                authModal(function() {
                                    window.location.href = "surveys.html?token=" + token;
                                });
                            }
                };
            }
        };

        var setButtonAction = function() {
            options.togleButton.click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                $(".menu-wrapper").toggleClass("toggled");
            });
        };
        var buildContainers = function() {
            options.pageContentWrapper = $('<div>').addClass('page-content-wrapper');
            options.pageContentWrapper.append(options.pageWrapper);
            $('body').append(options.pageContentWrapper);
        };
        var setOptions = function() {
            var div = $('<div>', {id: "sidebar-wrapper"});
            var ul = buildRoot();
            $(options.options).each(function() {
                var li = buildList(this);
                ul.append(li);
            });
            div.append(ul);
            options.pageWrapper.append(div);
        };
        var buildList = function(option) {
            var li = $('<li>').append('<a href="#">' + option.title + '</a>');
            if (option.onclick !== undefined)
                li.click(function() {
                    onclick(option.onclick);
                });
            return li;
        };
        var buildRoot = function() {
            var ul = $('<ul>', {class: "sidebar-nav"});
            setBrand(ul);
            return ul;
        };
        var setBrand = function(ul) {
            var brand = $('<li>', {class: "sidebar-brand"}).append('<a href="#">' + options.brandTitle + '</a>');
            return ul.append(brand);
        };
        var onclick = function(option) {
            if (typeof option === "function")
                return option();
            if (option.ajax === undefined)
                return 0;
            var ajax = option.ajax;
            if (ajax.method === undefined)
                ajax.method = "POST";
            if (ajax.type === undefined)
                ajax.type = true;
            if (ajax.cache === undefined)
                ajax.cache = false;
            if (ajax.params === undefined)
                ajax.params = {};
            $.ajax({
                method: ajax.method,
                async: ajax.type,
                cache: ajax.cache,
                data: ajax.params,
                url: ajax.url + "?" + $.param(ajax.params),
                success: function(response, textStatus, jqXHR) {
                    if (typeof ajax.success === "function")
                        return ajax.success(response, textStatus, jqXHR);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    if (typeof ajax.error === 'function')
                        return ajax.error(jqXHR, textStatus, errorThrown);
                    if (typeof jqXHR.error !== undefined)
                        e.error("Error", jqXHR.error);
                    e.error(jqXHR.statusText + " - " + jqXHR.status, jqXHR.responseText);
                }
            });
        };
        var getUrl = function(url) {
            if (url === undefined)
                return "";
            return  (url.charAt(0) === "/") ? (urlBase + url) : urlBase + "/" + url;
        };
    };
    return new Menu();
});