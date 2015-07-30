angular.module('starter.controllers', [])

.controller('MainCtrl', function($scope, $rootScope, $state) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.goToDraw = function (name) {

    $rootScope = {
      name: name
    };

    // Go To the Draw Page
    $state.go('draw');
  };
})

.controller('ListCtrl', function($scope) {
  $scope.$on('$ionicView.enter', function(e) {
    var items = localStorage.getItem('keynote2015-mobile-app');
    try {
      items = JSON.parse(items);
    } catch (err) {
      items = {containers: []};
    }
    $scope.containers = items.containers;
  });
})

.controller('DrawCtrl', function ($scope, $state, $http) {
$scope.$on('$ionicView.enter', function(e) {
  $scope.super_awesome_multitouch_drawing_canvas_thingy = new CanvasDrawr({id:"example", size: 15 });
  var canvas = document.querySelector('canvas'),
    ctx = canvas.getContext("2d");

  $scope.backAndClear = function () {
    ctx.clearRect(0,0, document.width, document.height);
  };

  $scope.submitToContainer = function () {
    // Submit to container then on success go to the List Page
    canvas.toBlob(function (blob) {

      var formData = new FormData();
      formData.append('sketch', blob, 'image.png');
      $http
        .post('/api/sketch/1', formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function () {
          console.log('success', arguments);
          // Need the container link
          var items = localStorage.getItem('keynote2015-mobile-app');

          if (!items) {
            items = {containers: []};
          }

          try {
            items = JSON.parse(items);
          } catch (err) {
            items = {containers: []};
          }

          items.containers.push({
            img: canvas.toDataURL()
          });

          items = JSON.stringify(items);

          // Save to the local storage
          localStorage.setItem('keynote2015-mobile-app', items);
          $state.go('list');
        })
        .error(function () {
          console.log('err', arguments);
        });
    });
    };
  });
});


