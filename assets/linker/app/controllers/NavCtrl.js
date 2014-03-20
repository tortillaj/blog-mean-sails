blog.controller('NavCtrl', ['$scope', '$rootScope', '$location', 'growl', 'Auth', '$modal', 'socket', function ($scope, $rootScope, $location, growl, Auth, $modal, socket) {

  $scope.search = function () {
    $location.path('/search/' + $scope.searchQuery);
  };

  $scope.logout = function () {
    Auth.logout().then(function (res) {
      $rootScope.isAuthenticated = false;
      growl.addInfoMessage(res.message);
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

  socket.on('post:create', function(data) {
    var created = data.post;
    growl.addSuccessMessage('Post: ' + created.title + ' created.');
  });

  socket.on('auth:user-login', function(data) {
    var user = data.user[0];
    growl.addSuccessMessage(user.username + ' has logged in!');
  });

}]);

var LoginModalInstanceCtrl = function ($scope, $rootScope, $modalInstance, growl, Auth, socket) {
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
        if (res.length) {
          $rootScope.isAuthenticated = true;
          $scope.cancel();
          $scope.$broadcast('auth:user-login');
          growl.addSuccessMessage('You are now authenticated.');
        }
      }, function (error) {
        $scope.password = '';
        $scope.$broadcast('auth:user-rejected');
        $scope.isError = true;
        $scope.errorMessage = error.message;
      });
  };
};