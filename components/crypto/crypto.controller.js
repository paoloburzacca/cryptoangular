(function () {

  'use strict';

  var myApp = angular.module('app');

  myApp.controller('CryptoController', myCryptoController);
  myApp.controller('OtherController', OtherController);
  myApp.controller('ChartController', myChartController);

  myApp.directive('highchartsColumn', function ($parse) {

      'use strict';

        return {
            restrict: 'E',
            template: '<div></div>',
            scope: {
                options: '='
            },
            link: function (scope, element, attrs) {

                attrs.chart = new Highcharts.chart(element[0], {
          					chart: {
          						type: 'column',
                      height:500,
                      width:650
          					},
          					title: {
          						text:  "Cryptocurrencies"
          					},
          					dataLabels: {
          						enabled: true
          					}
          				});

                scope.$watch(function() {
                					return attrs.categories;
                				}, function() {
                					if (attrs.chart.xAxis.length === 0) {
                						attrs.chart.addAxis($parse(attrs.categories)(scope));
                					} else {
                						attrs.chart.xAxis[0].setCategories($parse(attrs.categories)(scope));
                					}
                				});

      				scope.$watch(function() {
      					return attrs.series;
      				}, function() {
      					var i;
      					for (i = 0; i < $parse(attrs.series)(scope).length; i++) {
      						if (attrs.chart.series[i]) {
      							attrs.chart.series[0].setData($parse(attrs.series)(scope)[i].data);
      						} else {
      							attrs.chart.addSeries($parse(attrs.series)(scope)[i]);
      						}
      					}

      					if (i < attrs.chart.series.length - 1) {
      						var seriesLength = attrs.chart.series.length - 1;

      						for (j = seriesLength; j > i; j--) {
      							attrs.chart.series[j].remove();
      						}
      					}
      				});

            }
        };
    })

  myCryptoController.$inject  = ['$scope', 'authService', '$http', 'ngDialog'];
  myChartController.$inject   = ['$scope'];
  OtherController.$inject     = ['$scope','$http'];

  function myChartController($scope) {

    $scope.isActive = false;

    $scope.$on('disableChart', function(event, data) {
      console.log('disableChart');
      $scope.isActive = false;
    });

    $scope.$on('childEmit', function(event, data) {
       console.log('New page');
       updateChart(data);
     });

    $scope.myCategories = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

    $scope.mySeries = [{
      data: new Array(10),
      colorByPoint: true,
      colors: [
        '#d9534f',
        '#5cb85c',
        '#0275d8',
        '#d9534f',
        '#5cb85c',
        '#0275d8',
        '#d9534f',
        '#5cb85c',
        '#0275d8',
        '#d9534f'
      ]
    }];

    //updateChart(0);

    function updateChart(data) {

      $scope.mySeries[0].data = [];
      $scope.myCategories = [];
      //$scope.mySeries[0].colors = [];

      for (var i = 0; i < $scope.pageSize; i++) {

        if (typeof data.ranks != "undefined") {

            var thisRank = data.ranks[i];
            var nome = data.names[i];
            $scope.myCategories.push(nome);
            if (typeof thisRank == "undefined") thisRank = 0;

            //var crypto_coin = $scope.crypto_list[i];
            var newColor = getNewRandomColor();
            $scope.mySeries[0].data.push(thisRank);
            //$scope.mySeries[0].colors.push(newColor);

            //console.log("thisRank "+i+" = " + thisRank);
        }

      }

      $scope.isActive = true;

    };

    function getNewRandomColor() {
      return '#' + (function co(lor){   return (lor +=
        [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
        && (lor.length == 6) ?  lor : co(lor); })('');
    }

  }

  function myCryptoController($scope, authService, $http, ngDialog) {

    $scope.currentPage = 1;
    $scope.pageSize = 10;

    //vm.auth = authService;

    $scope.getCryptoCurrencyDetail = function(crypto_id) {

      $http.get('https://api.coinmarketcap.com/v2/ticker/' + crypto_id + '/?convert=EUR').then(function(response) {
        var crypto_detail = response.data.data;

        console.log(crypto_detail);

        if (crypto_detail != null)  {

          $scope.crypto_detail = crypto_detail;
          //$scope.crypto_detail = crypto_detail;

          ngDialog.open({
            scope: $scope,
            template: 'components/dialogs/popupTmpl.html',
            className: 'ngdialog-theme-default'
          });
        }
      });

    };

    $scope.getCryptoCurrencyList = function() {

      $http.get('https://api.coinmarketcap.com/v2/listings/').then(function(response) {
        var list = response.data.data;
        console.log(list);
        if (list != null)  $scope.crypto_list = list;
      });

    };

    $scope.pageChangeHandler = function(num) {
        console.log('meals page changed to ' + num);
    };
  }

  function OtherController($scope, $http) {

    $scope.init = function() {
      loadNewPage(1);
    };

    $scope.pageChangeHandler = function(num) {
      $scope.$emit('disableChart');
      loadNewPage(num);
    };

    function loadNewPage(num) {

      var cryptoIDS = [];
      var counter = 0;
      var ranks = [];
      var names = [];
      var currentPage = 0;

      currentPage = num;
      var start = (num - 1) * $scope.pageSize;
      var max = start + $scope.pageSize;

      for (var i = start; i < max; i++) {
        var crypto_coin = $scope.crypto_list[i];
        if (typeof crypto_coin != "undefined") cryptoIDS.push(crypto_coin.id);
      }

      getNextCryptoRank(cryptoIDS[counter]);

      function getNextCryptoRank(crypto_id) {

        console.log("getNextCryptoRank: " + crypto_id);

          $http.get('https://api.coinmarketcap.com/v2/ticker/' + crypto_id + '/?convert=EUR').then(function(response) {
            var crypto_detail = response.data.data;

            console.log("crypto_detail");
            console.log(crypto_detail);

            if (typeof crypto_detail != "undefined") {
                ranks.push(crypto_detail.rank)
                names.push(crypto_detail.name)
            }

            if (counter < $scope.pageSize - 1) {

              getNextCryptoRank(cryptoIDS[++counter]);

            } else {
              var obj = {page: currentPage, ranks:ranks, names: names};

              console.log("obj");
              console.log(obj);

              $scope.$emit('childEmit', obj);
            }

        },
        function(data) {

          if (counter < $scope.pageSize - 1) {

            getNextCryptoRank(cryptoIDS[++counter]);

          } else {
            var obj = {page: currentPage, ranks:ranks, names: names};

            console.log("obj");
            console.log(obj);

            $scope.$emit('childEmit', obj);
          }

        })
        ;
      }

    }

  }

})();
