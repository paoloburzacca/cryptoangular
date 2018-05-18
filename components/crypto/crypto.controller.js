(function () {

  'use strict';

  var myApp = angular.module('app');

  myApp.controller('CryptoController', myCryptoController);
  myApp.controller('OtherController', OtherController);

  myCryptoController.$inject = ['$scope', 'authService', '$http', 'ngDialog'];

  function myCryptoController($scope, authService, $http, ngDialog) {

    var vm = this;

    vm.currentPage = 1;
    vm.pageSize = 10;

    //vm.auth = authService;

    vm.getCryptoCurrencyDetail = function(crypto_id) {

      $http.get('https://api.coinmarketcap.com/v2/ticker/' + crypto_id + '/?convert=EUR').then(function(response) {
        var crypto_detail = response.data.data;
        console.log(crypto_detail);
        if (crypto_detail != null)  {

          vm.crypto_detail = crypto_detail;

          $scope.crypto_detail = crypto_detail;

          ngDialog.open({
            scope: $scope,
            template: 'components/dialogs/popupTmpl.html',
            className: 'ngdialog-theme-default'
          });
        }
      });

    };

    vm.getCryptoCurrencyList = function() {

      $http.get('https://api.coinmarketcap.com/v2/listings/').then(function(response) {
        var list = response.data.data;
        console.log(list);
        if (list != null)  vm.crypto_list = list;
      });

    };

    vm.pageChangeHandler = function(num) {
        console.log('meals page changed to ' + num);
    };

  }

function OtherController($scope) {

  var vm = this;

  vm.pageChangeHandler = function(num) {
    console.log('going to page ' + num);
  };
}


})();
