define(['jquery', 'bootstrap-notify'], function($, $notify) {
    var Notify = function() {
        $.notifyDefaults({
            animate: {
                enter: "animated fadeInUp",
                exit: "animated fadeOutDown"
            }
        });

        this.success = function(message = "Éxito", barProgress = false) {
            var notify = $.notify({
                message: message,
                icon: 'glyphicon glyphicon-ok'
            }, {
                type: "success",
                allow_dismiss: (barProgress) ? false : true,
                showProgressbar: barProgress
            });
        };

        this.warning = function(message = "Advertencia", barProgress = false) {
            var notify = $.notify({
                message: message,
                icon: 'glyphicon glyphicon-warning-sign',
            }, {
                type: "warning",
                allow_dismiss: (barProgress) ? false : true,
                showProgressbar: barProgress
            });
        };

        this.error = function(message = "Error", barProgress = false) {
            console.log("error");
            var notify = $.notify({
                message: message,
                icon: 'glyphicon glyphicon-exclamation-sign',
                enter: 'animated bounceInDown',
                exit: 'animated bounceOutUp'
            },
                    {
                        type: "danger",
                        allow_dismiss: (barProgress) ? false : true,
                        showProgressbar: barProgress,
                        animate: {
                            enter: 'animated bounceInDown',
                            exit: 'animated bounceOutUp'
                        }
                    });
        };

        this.info = function(message = "Información", barProgress = false) {
            var notify = $.notify(message + ' ...', {
                message: message,
                icon: 'glyphicon glyphicon-exclamation-sign',
                type: 'info',
            }, {
                type: "success",
                allow_dismiss: (barProgress) ? false : true,
                showProgressbar: barProgress
            });

//            setTimeout(function() {
//                notify.update({'type': 'success', title: "titulo", 'message': '<strong>Success</strong> Your page has been saved!', 'progress': 25});
//            }, 4500);
        };

        var configuration = {
            animate: {
                enter: 'animated bounceInDown',
                exit: 'animated bounceOutUp'
            }
        }

    };

    return new Notify();
});