
define(['jquery'], function($){
    var Alerts = function(){    
        var formErrorClass = 'has-error';
        this.addFormError = function(input){
            $(input).closest('.form-group').addClass(formErrorClass);
        };
        
        this.removeFormError = function(input){
            $(input).closest('.form-group').removeClass(formErrorClass);
        };
        
        this.isHasFormError = function(input){
            return $(input).closest('.form-group').hasClass(formErrorClass);
        };
    };
    
    var alert = new Alerts();
    
    return alert;
});