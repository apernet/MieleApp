
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
                    title: "- Sincronizar",
                    onclick:
                        function() {
                            window.location.href = "sync.html?token=" + token;
                        }
                };
            },

            syncCatalog: function(token) {
                return {
                    title: "- Sincronizar Catálogo",
                    onclick:
                        function() {
                            window.location.href = "syncCatalog.html?token=" + token;
                        }
                };
            },
            /**
             * 
             * @param {type} token
             * @returns {systemL#2.system.menu.option.closeSessionOption.systemAnonym$1}
             */
            closeSessionOption: function(token) {
                return {
                    title: "- Cerrar Sesión",
                    onclick:
                        function() {
                            window.location.href = "login.html";
                        }
                };
            },
            goToHome: function(token) {
                return {
                    title: "- Home",
                    onclick:
                        function() {
                            window.location.href = "home.html?token=" + token;
                        }
                };
            },
            goToSurveysInterface: function(token) {
                return {
                    title: "- Encuestas",
                    onclick:
                        function() {
                            window.location.href = "surveys.html?token=" + token;
                        }
                };
            },
            goToClothesCare: function(token) {
                return {
                    title: "- Cuidado de la ropa",
                    tag: "cuidadoDeLaRopaDrop",
                    dropdown: [
                        {
                            title: "  - Lavadoras",
                            onclick:
                                function() {
                                    window.location.href = "products.html?token=" + token;
                                }
                        },
                        {
                            title: "  - Secadoras",
                            onclick:
                                function() {
                                    window.location.href = "products.html?token=" + token;
                                }
                        },
                        {
                            title: "  - Máquinas de planchar",
                            onclick:
                                function() {
                                    window.location.href = "products.html?token=" + token;
                                }
                        }
                    ],
                    onclick:
                        function() {
                            dropdownToogle('cuidadoDeLaRopaDrop');
                        }
                };
            },
            goToCooking: function(token) {
                return {
                    title: "- Experiencia culinaria",
                    tag: "experienciaCulinaria",
                    dropdown: [
                        {
                            title: "  - Lavadoras",
                            onclick:
                                function() {
                                    window.location.href = "products.html?token=" + token;
                                }
                        },
                        {
                            title: "  - Secadoras",
                            onclick:
                                function() {
                                    window.location.href = "products.html?token=" + token;
                                }
                        },
                        {
                            title: "  - Máquinas de planchar",
                            onclick:
                                function() {
                                    window.location.href = "products.html?token=" + token;
                                }
                        }
                    ],
                    onclick:
                        function() {
                            dropdownToogle('experienciaCulinaria');
                        }
                };
            },
            goToVacuum: function(token) {
                return {
                    title: "- Aspiradoras",
                    tag: "aspiradoras",
                    dropdown: [
                        {
                            title: "  - Lavadoras",
                            onclick:
                                function() {
                                    window.location.href = "products.html?token=" + token;
                                }
                        },
                        {
                            title: "  - Secadoras",
                            onclick:
                                function() {
                                    window.location.href = "products.html?token=" + token;
                                }
                        },
                        {
                            title: "  - Máquinas de planchar",
                            onclick:
                                function() {
                                    window.location.href = "products.html?token=" + token;
                                }
                        }
                    ],
                    onclick:
                        function() {
                            dropdownToogle('aspiradoras');
                        }
                };
            },goToAccessories: function(token) {
                return {
                    title: "- Accesorios",
                    tag: "accesorios",
                    dropdown: [
                        {
                            title: "  - Lavadoras",
                            onclick:
                                function() {
                                    window.location.href = "products.html?token=" + token;
                                }
                        },
                        {
                            title: "  - Secadoras",
                            onclick:
                                function() {
                                    window.location.href = "products.html?token=" + token;
                                }
                        },
                        {
                            title: "  - Máquinas de planchar",
                            onclick:
                                function() {
                                    window.location.href = "products.html?token=" + token;
                                }
                        }
                    ],
                    onclick:
                        function() {
                            dropdownToogle('accesorios');
                        }
                };
            }
        };

        var dropdownToogle = function(tag) {
            var dropdownContent = $('.' + tag);
            if (dropdownContent.css('display') == 'block') {
                console.log('blocked');
                dropdownContent.css('display','none');
            } else {
                dropdownContent.css('display','block');
            }
            //$('#myModal').css('display','block');
            //console.log(dropdownContent.css('display'));
        }

        var setButtonAction = function() {
            options.togleButton.click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                //$(".menu-wrapper").style.display = "block";
                $(this).toggleClass('glyphicon-menu-hamburger').toggleClass('glyphicon-remove');
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
                var li;
                if (this.dropdown !== undefined) {
                    li = buildDropdown(this);
                } else {
                    li = buildList(this);
                }
                ul.append(li);
            });
            div.append(ul);
            options.pageWrapper.append(div);
        };

        var buildDropdown = function(option) {
            
            var li = $('<li>').append($('<button>').append(option.title).append($('<i>', {class: 'fa fa-caret-down'})));
            var div = $('<div>', {class: option.tag});

            $(option.dropdown).each(function() {
                console.log(this);
                var liDrop = buildListDrop(this);
                div.append(liDrop);
                div.css('display','none');
            });

            li.append(div);
            
            if (option.onclick !== undefined)
                li.click(function() {
                    onclick(option.onclick);
                });
            return li;
        };

        var buildListDrop = function(option) {
            var li = $('<li>', {class: 'liDrop'}).append('<a href="#">' + option.title + '</a>');
            if (option.onclick !== undefined)
                li.click(function() {
                    onclick(option.onclick);
                });
            return li;
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