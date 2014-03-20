blog.controller('PostIndexCtrl', ['$scope', '$routeParams', 'growl', 'Post', function ($scope, $routeParams, growl, Post) {
  var page = $routeParams.page || 1;

  if ($routeParams.query) {
    $scope.datas = Post.search({page: page, query: $routeParams.query});
    $scope.prevLink = '/search?q=' + $routeParams.query + '&page=' + ($scope.datas.currentPage - 1);
    $scope.nextLink = '/search?q=' + $routeParams.query + '&page=' + ($scope.datas.currentPage + 1);
  } else {
    if ($routeParams.tag) {
      $scope.datas = Post.tag({ tag: $routeParams.tag, page: page }, console.dir($scope.datas));
    } else if ($routeParams.category) {
      $scope.datas = Post.category({ category: $routeParams.category, page: page });
    } else {
      $scope.datas = Post.index({ page: page });
    }
    $scope.prevLink = '/page/' + ($scope.datas.currentPage - 1);
    $scope.nextLink = '/page/' + ($scope.datas.currentPage + 1);
  }

}]);