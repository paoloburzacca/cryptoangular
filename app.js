(function () {

  'use strict';

  angular
    .module('app', ['smart-table', 'ngCsv', 'ngSanitize', 'ngDialog', 'auth0.auth0', 'angular-jwt', 'ui.router', 'angular-loading-bar', 'angularUtils.directives.dirPagination', 'angular-preload-image'])
    .config(config);

  config.$inject = ['$stateProvider', '$locationProvider', 'angularAuth0Provider', '$urlRouterProvider', 'jwtOptionsProvider', 'cfpLoadingBarProvider'];

  function config($stateProvider, $locationProvider, angularAuth0Provider, $urlRouterProvider, jwtOptionsProvider, cfpLoadingBarProvider) {

    //cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    //cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Custom Loading Message...</div>';

    $stateProvider
      .state('home', {
        url: '/home',
        controller: 'HomeController',
        templateUrl: 'components/home/home.html',
        controllerAs: 'vm'
      })
      .state('crypto', {
        url: '/crypto',
        controller: 'CryptoController',
        templateUrl: 'components/crypto/crypto.html',
        controllerAs: 'vm'
      });

    // Initialization for the angular-auth0 library
    angularAuth0Provider.init({
      clientID: AUTH0_CLIENT_ID,
      domain: AUTH0_DOMAIN,
      responseType: 'token id_token',
      redirectUri: AUTH0_CALLBACK_URL,
      audience: AUTH0_API_AUDIENCE
    });

    // Configure a tokenGetter so that the isAuthenticated
    // method from angular-jwt can be used
    jwtOptionsProvider.config({
      tokenGetter: function() {
        return localStorage.getItem('id_token');
      }
    });

    $urlRouterProvider.otherwise('/home');

    // Remove the ! from the hash so that
    // auth0.js can properly parse it
    $locationProvider.hashPrefix('');

  }

})();
