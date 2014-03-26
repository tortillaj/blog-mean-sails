blog.controller('PostIndexCtrl', ['$scope', '$routeParams', 'growl', 'Post', function ($scope, $routeParams, growl, Post) {
  var page = $routeParams.page || 1;

  if ($routeParams.query) {
    $scope.datas = Post.search({page: page, query: $routeParams.query});
    $scope.prevLink = '/search?q=' + $routeParams.query + '&page=' + ($scope.datas.currentPage - 1);
    $scope.nextLink = '/search?q=' + $routeParams.query + '&page=' + ($scope.datas.currentPage + 1);

    $scope.meta.setTitle('Search for ' + $routeParams.query);
  } else {
    if ($routeParams.tag) {
      $scope.datas = Post.tag({ tag: $routeParams.tag, page: page });
      $scope.meta.setTitle($routeParams.tag);
    } else if ($routeParams.category) {
      $scope.datas = Post.category({ category: $routeParams.category, page: page });
      $scope.meta.setTitle($routeParams.category);
    } else {
      $scope.datas = Post.index({ page: page });
      $scope.meta.setTitle('Articles');
    }
    $scope.prevLink = '/page/' + ($scope.datas.currentPage - 1);
    $scope.nextLink = '/page/' + ($scope.datas.currentPage + 1);
  }

}]);