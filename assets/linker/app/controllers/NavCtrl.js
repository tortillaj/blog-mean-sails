blog.controller('NavCtrl', ['$scope', '$rootScope', '$location', 'growl', 'Auth', '$modal', function ($scope, $rootScope, $location, growl, Auth, $modal) {

  $scope.search = function () {
    $location.path('/search/' + $scope.searchQuery);
  };

  $scope.logout = function () {
    Auth.logout().then(function (res) {
      $rootScope.isAuthenticated = false;
      growl.addInfoMessage('You have been logged out.');
    });
  };

  $scope.open = function () {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal/login.html',
      controller: LoginModalInstanceCtrl
    });
  };

}]);

var LoginModalInstanceCtrl = function ($scope, $rootScope, $modalInstance, growl, Auth) {
  $scope.username = '';
  $scope.password = '';

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.login = function (username, password) {
    $scope.isError = false;
    $scope.username = username;
    $scope.password = password;

    Auth.login({
      username: $scope.username,
      password: $scope.password
    }).then(function (res) {
        $rootScope.isAuthenticated = true;
        $scope.cancel();
        $scope.$broadcast('event:auth-confirmed');
        growl.addSuccessMessage('You are now authenticated.');
      }, function (error) {
        $scope.password = '';
        $scope.$broadcast('event:auth-rejected');
        $scope.isError = true;
        $scope.errorMessage = 'Something goes wrong! ' + error.message;
      });
  };
};