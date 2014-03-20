blog.controller('NavCtrl', ['$scope', '$rootScope', '$location', 'growl', 'Auth', '$modal', 'socket', function ($scope, $rootScope, $location, growl, Auth, $modal, socket) {

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
      templateUrl: '/partials/modal/login.html',
      controller: LoginModalInstanceCtrl
    });
  };

  socket.on('post:update', function(post) {
    var updated = post.post[0];
    growl.addSuccessMessage('Post: ' + updated.title + ' updated.');
  });

  socket.on('post:create', function(post) {
    growl.addSuccessMessage('Post: ' + post.post.title + ' created.');
  });

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