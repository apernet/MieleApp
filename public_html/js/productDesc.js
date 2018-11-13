
/* global JSONStore */

define(['jquery', 'system', 'menu', 'exceptions'], function($, system, menu, e) {
    var Survey = function() {
        var self = this;
        var token = null;
        var slideIndex = 1;
        
        this.init = function() {
            token = system.getUrlParameter("token");
            setTokenValue();
            resizeContent();
            buildSurveyBoxes();
            engineSearch();

        };

        var resizeContent = function() {
            $('#boxContent').height($(window).height() - 150);
            buildMenu();
        };

        var buildMenu = function() {
            menu.init({
                buttonSelector: "menu-toggle",
                pageWrapper: "pageWrapper",
                brandTitle: "Miele",
                options: [
                    menu.option.goToHome(token),
                    menu.option.goToClothesCare(token),
                    menu.option.goToCooking(token),
                    menu.option.goToVacuum(token),
                    menu.option.goToAccessories(token),
                    menu.option.syncCatalog(token),
                    menu.option.closeSessionOption(token)
                ]
            });
        };

        var buildSurveyBoxes = function() {
            self.getSurveys(function(surveyType) {
                surveyType = [{"_id":1, "json":{"id": 1,"name": "LAVADORA W1","icon": "https://shop.miele.com.mx/811-home_default/lavadora-w1.jpg", "model": "Mod: WKH122 WPS", "cost": "$66,900.00", "description": "Lavadora, capacidad de carga de 9Kg, color blanco. Carga frontal. <br> (La entrega de este producto será a partir de Marzo del 2018).", "attributes": "<li>Cuidado especialde la ropa gracias a su tambor patentado 'Honeycomb'.</li> <li>Color: blanco.</li> <li>Carga frontal.</li> <li>Capacidad: 9kg</li> <li>Reconocimiento automático de carga</li> <li>Sistema TwinDos - el mejor sistema de dosificación de detergente líquido</li> <li>PowerWash 2.0Ñ Tecnología única de centrifugado y espreado durante el proceso de lavado optimizando el consumo de agua.</li> <li>QuickPowerWash: Limpieza profuna y máxima velocidad, ropa limpia en menos de una hora.</li>", "slider": {"img1": "https://shop.miele.com.mx/821-home_default/lavadora-w1.jpg", "img2": "https://shop.miele.com.mx/824-home_default/lavadora-w1.jpg", "img3": "https://shop.miele.com.mx/822-home_default/lavadora-w1.jpg", "img4": "https://shop.miele.com.mx/823-home_default/lavadora-w1.jpg"}}}];

                $(surveyType).each(function() {
                    if(this.json !== undefined) {
                        $('#boxContent').append(buildIcon(this.json));
                        $('#boxContent').append(buildInfo(this.json));
                        $('#boxContent').append(buildSlider(this.json));
                    } else {
                        $('#boxContent').append(buildDesc(this));         
                    }
                });

                $('.close').on('click', function() {
                    var modal = document.getElementById('myModal');
                    $('#myModal').css('display','none');
                });

                $('.dot-img').on('click', function() {
                    //console.log(this);
                    var n = parseInt(this.id);
                    currentSlide(n);
                });

                $('.prev').on('click', function() {
                    plusSlides(-1);
                });               

                $('.next').on('click', function() {
                    plusSlides(1);
                });

                $('.product-img').on('click', function() {
                    console.log(slideIndex);
                    slideIndex = parseInt(this.id);
                    $('#myModal').css('display','block');
                    showSlides(slideIndex);
                    //console.log(this.id);
                    //var idImg = this.id;
                    //var idSurvey = $(this).attr('idSurvey');
                    //(parseInt(idSurvey) > 0) ? system.goToSurveyInterface(token, idSurvey) : e.error("No fue posible abrir la encuesta", "No se obtuvo el identificador de la encuesta a contestar");
                });
            });
        };

        // Next/previous controls
        var plusSlides = function(n) {
          showSlides(slideIndex += n);
        }

        // Thumbnail image controls
        var currentSlide = function(n) {
          showSlides(slideIndex = n);
        }

        var showSlides = function(n) {
          var i;
          var slides = document.getElementsByClassName("mySlides");
          var dots = document.getElementsByClassName("dot");
          
          if (n > slides.length) {slideIndex = 1} 
          if (n < 1) {slideIndex = slides.length}
          for (i = 0; i < slides.length; i++) {
              slides[i].style.display = "none"; 
          }
          //for (i = 0; i < dots.length; i++) {
          //    dots[i].className = dots[i].className.replace(" active", "");
          //}
          //console.log(slides);
          slides[slideIndex-1].style.display = "block"; 
          //dots[slideIndex-1].className += " active";
        }

        var buildIcon = function(product) {
            //console.log(product.id);
            var icon = $('<div>', {class: "product-icon"}).append($('<img>', {class: "icon", src: product.icon}));
            var productionIconBox = $('<div>', {class: "box"}).append(icon);
            var productIcon = $('<div>', {class: "col-sm-4 box-content survey", surveyName: product.name, idSurvey: product.id}).append(productionIconBox);
            return productIcon;
        }

        var buildInfo = function(product) {
            //console.log(product.id);
            var name = $('<div>', {class: "product-title"}).append(product.name);
            var model = $('<div>', {class: "product-model"}).append(product.model);
            var cost = $('<div>', {class: "product-cost"}).append(product.cost);
            var description = $('<div>', {class: "product-description"}).append(product.description);
            var descriptionTitle = $('<div>', {class: "product-description-title"}).append('Descripción').append($('<span>', {class: "product-attributes-title"}).append('Atributos'));
            var attributes = $('<div>', {class: "product-attributes"}).append(product.attributes);
            var productInfoBox = $('<div>', {class: "box"}).append(name).append(model).append(cost).append(description).append(descriptionTitle).append(attributes);
            var productInfo = $('<div>', {class: "col-sm-8 box-content survey", surveyName: product.name, idSurvey: product.id}).append(productInfoBox);
            return productInfo;
        }

        var buildSlider = function(product) {
            //console.log(product.id);
            var slider = product.slider;
            var img1 = $('<span>', {class: "product-img1"}).append($('<img>', {class: "product-img", id: "1", src: product.icon}));
            var img2 = $('<span>', {class: "product-img1"}).append($('<img>', {class: "product-img", id: "2", src: slider.img1}));
            var img3 = $('<span>', {class: "product-img2"}).append($('<img>', {class: "product-img", id: "3", src: slider.img2}));
            var img4 = $('<span>', {class: "product-img3"}).append($('<img>', {class: "product-img", id: "4", src: slider.img3}));
            var img5 = $('<span>', {class: "product-img4"}).append($('<img>', {class: "product-img", id: "5", src: slider.img4}));
            var productSliderbox = $('<div>', {class: "sliderbox"}).append(img2).append(img3).append(img4).append(img5);

            var close = $('<span>', {class: "close"}).append('&times;');
            var header = $('<h2>').append(product.name);
            var modalHeader = $('<div>', {class: "modal-header"}).append(close).append(header);


            var slide1 = $('<div>', {class: "mySlides"}).append($('<div>', {class: "numbertext"}).append('1 / 5')).append($('<img>', {class: "slider-img", src: product.icon}));
            var slide2 = $('<div>', {class: "mySlides"}).append($('<div>', {class: "numbertext"}).append('2 / 5')).append($('<img>', {class: "slider-img", src: slider.img1}));
            var slide3 = $('<div>', {class: "mySlides"}).append($('<div>', {class: "numbertext"}).append('3 / 5')).append($('<img>', {class: "slider-img", src: slider.img2}));
            var slide4 = $('<div>', {class: "mySlides"}).append($('<div>', {class: "numbertext"}).append('4 / 5')).append($('<img>', {class: "slider-img", src: slider.img3}));
            var slide5 = $('<div>', {class: "mySlides"}).append($('<div>', {class: "numbertext"}).append('5 / 5')).append($('<img>', {class: "slider-img", src: slider.img4}));
            var prev = $('<a>', {class: "prev"}).append('&#10094;');
            var next = $('<a>', {class: "next"}).append('&#10095;');
            var slideshowContainer = $('<div>', {class: "slideshow-container"}).append(slide1).append(slide2).append(slide3).append(slide4).append(slide5).append(prev).append(next);
            var modalBody = $('<div>', {class: "modal-body"}).append(slideshowContainer);

            var dotImg1 = $('<span>').append($('<img>', {class: "dot-img", id: "1", src: product.icon}));
            var dotImg2 = $('<span>').append($('<img>', {class: "dot-img", id: "2", src: slider.img1}));
            var dotImg3 = $('<span>').append($('<img>', {class: "dot-img", id: "3", src: slider.img2}));
            var dotImg4 = $('<span>').append($('<img>', {class: "dot-img", id: "4", src: slider.img3}));
            var dotImg5 = $('<span>').append($('<img>', {class: "dot-img", id: "5", src: slider.img4}));
            var modalFooter = $('<div>', {class: "modal-footer"}).append(dotImg1).append(dotImg2).append(dotImg3).append(dotImg4).append(dotImg5);

            var modalContent = $('<div>', {class: "modal-content"}).append(modalHeader).append(modalBody).append(modalFooter);
            var modal = $('<div>', {class: "modal", id: "myModal"}).append(modalContent);

            var productSlider = $('<div>', {class: "col-sm-12 box-content pictures", surveyName: product.name, idSurvey: product.id}).append(productSliderbox).append(modal);
            return productSlider;
        }

        /**
         * 
         * @param {type} token
         * @returns {response}
         */
        var getRemoteSurveys = function(token) {
            var surveys = null;
            $.ajax({
                method: "POST",
                async: false,
                cache: false,
                data: {},
                url: system.getSystemPath() + "/survey/?token=" + token,
                success: function(response, textStatus, jqXHR) {
                    if (typeof response !== 'object')
                        e.error("Respuesta inesperada", response);

                    surveys = response;
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
            return surveys;
        };

        this.getSurveys = function(callback) {
            if(typeof JSONStore !== 'undefined'){
                return JSONStore.init({surveys: {searchFields: {id: 'string'}}})
                        .then(function() {
                            return JSONStore.get("surveys").findAll();
                        })
                        .fail(function(error) {
                            alert("Error al obtener encuestas: " + error);
                        })
                        .then(function(arrayResults) {
                            if (typeof callback === "function")
                                callback(arrayResults);
                        });
                    }
            else{
                var surveysList = getRemoteSurveys(token);
                return callback(surveysList);
            }
        };

        var engineSearch = function() {
            $('#formSearch').keyup(function() {
                searchSurvey($.trim($(this).val()));
            });
        };

        var searchSurvey = function(surveyName) {
            var regex = new RegExp("(" + surveyName + ")", "ig");
            $('.box-content').each(function() {
                if (String(surveyName).length === 0) {
                    $('.box-content').show();
                    return false;
                }

                (String($(this).attr('surveyName')).search(regex) === -1) ? $(this).hide() : $(this).show();
            });
        };

        var setTokenValue = function() {
            token = system.getUrlParameter("token");
        };

        this.getSurvey = function(idSurvey, callback) {
            var query = {id: idSurvey};
            if(typeof JSONStore !== 'undefined')
                return JSONStore.init({surveys: {searchFields: {id: 'string'}}})
                        .then(function() {
                            return JSONStore.get("surveys")
                            .find(query, {});
                        })
                        .fail(function(error) {
                            alert("Error al obtener encuesta: " + error);
                        })
                        .then(function(arrayResults) {
                            arrayResults = (typeof arrayResults[0].json !== undefined) ? arrayResults[0].json : null;

                            if (typeof callback === "function")
                                callback(arrayResults);
                            else
                                return arrayResults;
                        });
            else
                callback(getRemoteSurvey(idSurvey));
        };
        var getRemoteSurvey = function(idSurvey) {
            setTokenValue();
            var survey = null;
            $.ajax({
                method: "POST",
                async: false,
                cache: false,
                data: {},
                url: system.getSystemPath() + "/survey/?id=" + idSurvey + "&token=" + token,
                success: function(response, textStatus, jqXHR) {
                    if (typeof response !== 'object')
                        e.error("Respuesta inesperada", response);

                    survey = response;
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    e.manageError(jqXHR, textStatus, errorThrown);
                }
            });
            return (survey[0] !== undefined) ? survey[0] : null;
        };
    };

    return new Survey();
});