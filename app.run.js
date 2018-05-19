  (function () {

  'use strict';

  angular
    .module('app')
    .run(function ($rootScope, $location, authService) {

      // Put the authService on $rootScope so its methods
      // can be accessed from the nav bar
      $rootScope.auth = authService;

      // Process the auth token if it exists and fetch the profile
      authService.handleParseHash();

      if (!authService.isAuthenticated()) {
          console.log('DENY : Redirecting to Login');
          event.preventDefault();
          $location.path('/login');
        }
        else {
          console.log('ALLOW');
        }

    });

})();
