blog.controller('AppCtrl', ['$scope', 'Globals', function ($scope, Globals) {

  $scope.metaTitle = Globals.title + ' | ' + Globals.titlePrefix;

  $scope.setMetaTitle = function (title) {
    $scope.metaTitle = title + ' | ' + Globals.titlePrefix;
  };

  $scope.bannerImage = Globals.banner;

  $scope.setBanner = function(img) {
    $scope.bannerImage = img;
  };

  $scope.$on('$routeChangeStart', function(event, current, previous) {
    $scope.bannerImage = Globals.banner;
  });

}]);