blog.controller('PostEditCtrl', ['$scope', '$location', '$routeParams', 'growl', '$document', 'Post', 'socket', function ($scope, $location, $routeParams, growl, $document, Post, socket) {

  if ($routeParams.id) {
    $scope.post = Post.show({ id: $routeParams.id });
    $scope.title = 'Edit post';
    $scope.buttonLabel = 'Update';
  } else {
    $scope.post = new Post();
    $scope.title = 'New post';
    $scope.buttonLabel = 'Publish';
  }

  $scope.meta.setTitle($scope.title);

  $scope.submit = function () {

    var failure = function (error) {
      growl.addErrorMessage(error);
    };

    if ($routeParams.id) {
      $scope.post.$update({ id: $routeParams.id }, function(response, status) {
        data = response[0];
        console.dir(data);
        growl.addSuccessMessage('Post <strong>' + data.title + '</strong> has been successfully updated.');
        $location.path('/article/' + data.slug + '/' + data.id);
      }, function(error) {
        failure(error);
      });
    } else {
      $scope.post.$save(function(response) {
        if (response.$resolved) {
          growl.addSuccessMessage('Post <strong>' + response.title + '</strong> has been successfully created.');
          $location.path('/article/' + response.slug + '/' + response.id);

          socket.emit('post:create', { post: response });
        }
      }, function(response) {
        failure(response.data.message);
      });
    }
  };

}]);