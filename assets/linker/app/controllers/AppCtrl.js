blog.controller('AppCtrl', ['$scope', 'Globals', function ($scope, Globals) {

  $scope.metaTitle = Globals.title + ' | ' + Globals.titlePrefix;

  $scope.setMetaTitle = function (title) {
    $scope.metaTitle = title + ' | ' + Globals.titlePrefix;
  };

  $scope.hideBannerImage = true;
  $scope.bannerImage = Globals.banner;

  $scope.setBanner = function(img) {
    $scope.bannerImage = img;
  };

  $scope.$on('$routeChangeStart', function(event, current, previous) {
    $scope.hideBannerImage = true;
    $scope.bannerImage = Globals.banner;
  });

  $scope.$on('image:banner:loaded', function(event) {
    console.log('controller listener');
    $scope.hideBannerImage = false;
    $scope.$apply();
  });

}]);