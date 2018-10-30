/* global require */

require.config({
    baseUrl: './',
    paths: {
        jquery: 'apis/jquery-3.1.1.min',
        bootstrap: 'apis/bootstrap/js/bootstrap.min',
        login: 'js/login',
        alerts: 'js/alerts',
        validator: 'js/validator',
        'bootstrap-dialog': 'apis/bootstrap3-dialog/dist/js/bootstrap-dialog.min',
        "bootstrap-star-rating": "apis/bootstrap-star-rating/js/star-rating",
        "bootstrap-star-rating-es": "apis/bootstrap-star-rating/js/locales/es",
        'bootstrap-notify': 'apis/bootstrap-notify/bootstrap-notify',
        "jquery.bxslider": "apis/jquery.bxslider/jquery.bxslider",
        "jquery-ui": "apis/jquery-ui/jquery-ui",
        exceptions: 'js/exceptions',
        notify: 'js/notify',
        system: 'js/system',
        index: 'js/index',
        menu: 'js/menu',
        home: 'js/home',
        survey: 'js/surveys',
        line: 'js/lines',
        subline: 'js/sublines',
        product: 'js/products',
        productDesc: 'js/productDesc',
        surveyInterface: 'js/surveyInterface',
        surveys: 'js/surveys',
        surveyBuilder: 'js/surveyBuilder',
        surveyType: 'js/surveyType',
        questionType: 'js/questionType',
        sync: 'js/sync',
        jsonstore: 'js/jsonstore'
    },
    shim: {
        jquery: {
            exports: 'jQuery'
        },
        "bootstrap": {
            "deps": ['jquery']
        },
        'bootstrap-dialog': {
            "deps": ['jquery', 'bootstrap']
        },
        'jquery.bxslider': {
            "deps":['jquery']
        },
        "bootstrap-star-rating": {
            "deps": ['jquery']
        },
        "bootstrap-star-rating-es": {
            "deps":['bootstrap-star-rating']
        },
        surveyBuilder: {
            "deps": ['bootstrap-star-rating', 'bootstrap-star-rating-es']
        },
        'bootstrap-notify': {
            "deps": ['jquery', 'bootstrap']
        },
        "jquery-ui": {
            "deps": ['jquery']
        }
    },
    waitSeconds: 200
});
