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
        exceptions: 'js/exceptions',
        system: 'js/system',
        index: 'js/index',
        menu: 'js/menu',
        home: 'js/home',
        survey: 'js/surveys'
    },
    shim: {
        jquery: {
            exports: 'jQuery'
        },
        "bootstrap": {"deps": ['jquery']},
        'bootstrap-dialog': ['jquery','bootstrap']
    }
});
