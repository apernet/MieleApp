
define(['bootstrap-dialog'],function(bdialog){
    var Exception = function(){
        this.INTERNAL_SERVER_ERROR = "Internal Server Error";
        
        this.error = function(title, textContent){
            bdialog.show({
                type: bdialog.TYPE_DANGER,
                title: title,
                size: bdialog.SIZE_NORMAL,
                message: $('<p>').append(textContent),
                buttons: [{
                        label: "cerrar",
                        title: "cerrar",
                        action: function(dialog){
                            dialog.close();
                        }
                }]
            });
        };
    };
    
    return new Exception();
});