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
      $scope.post.$update({ id: $routeParams.id }, function(post) {
        growl.addSuccessMessage('Post <strong>' + post.title + '</strong> has been successfully updated.');
        $location.path('/' + post.slug + '/' + post.id);
      }, function(error) {
        failure(error);
      });
    } else {
      Post.create($scope.post, function (post) {
        growl.addSuccessMessage('Post <strong>' + post.title + '</strong> has been successfully created.');
        $location.path('/' + post.slug + '/' + post.id);
      }, failure);
    }
  };
}]);