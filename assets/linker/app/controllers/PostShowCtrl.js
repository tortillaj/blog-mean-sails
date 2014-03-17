blog.controller('PostShowCtrl', ['$scope', '$routeParams', '$location', 'growl', 'Post', function ($scope, $routeParams, $location, growl, Post) {

  $scope.post = Post.show({id: $routeParams.id}, function(data) {
    console.dir(data);
    console.dir(Prism);
    Prism.highlightAll();
  });

  $scope.destroyPost = function () {
    Post.destroy({ id: $scope.post.id }, function (data) {
      console.dir(data);
      growl.addSuccessMessage('Post has been successfully deleted.');
      $location.path('/');
    }, function (err) {
      growl.addErrorMessage('Something goes wrong, Error type:' + err);
    });
  };
}]);