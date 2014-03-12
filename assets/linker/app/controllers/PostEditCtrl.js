blog.controller('PostEditCtrl', ['$scope', '$location', '$routeParams', 'growl', 'Post', function ($scope, $location, $routeParams, growl, Post) {

  if ($routeParams.id) {
    $scope.post = Post.show({ id: $routeParams.id });
    $scope.pageTitle = 'Edit post';
    $scope.buttonLabel = 'Update';
  } else {
    $scope.post = new Post();
    $scope.pageTitle = 'New post';
    $scope.buttonLabel = 'Publish';
  }

  $scope.submit = function () {

    var failure = function (error) {
      growl.addErrorMessage('Something goes wrong: ' + error);
    };

    if ($routeParams.id) {
      $scope.post.$update({ id: $routeParams.id }, function(response, status) {
        data = response[0];
        growl.addSuccessMessage('Post <strong>' + data.title + '</strong> has been successfully updated.');
        $location.path('/' + data.slug + '/' + data.id);
      }, function(error) {
        failure(error);
      });
    } else {
      $scope.post.$save(function(response) {
        if (response.$resolved) {
          growl.addSuccessMessage('Post <strong>' + response.title + '</strong> has been successfully created.');
          $location.path('/' + response.slug + '/' + response.id);
        } else {
          failure(error);
        }
      });
    }
  };
}]);