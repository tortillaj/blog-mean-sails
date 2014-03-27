blog.controller('PostIndexCtrl', ['$scope', '$routeParams', 'growl', 'Post', function ($scope, $routeParams, growl, Post) {

  var page = $routeParams.page || 1;
  var params = { page: page };

  if ($routeParams.query) {
    params.query = $routeParams.query;
    $scope.datas = Post.search(params);
    $scope.prevLink = '/#!/search?q=' + $routeParams.query + '&page=' + ($scope.datas.currentPage - 1);
    $scope.nextLink = '/#!/search?q=' + $routeParams.query + '&page=' + ($scope.datas.currentPage + 1);

    $scope.meta.setTitle('Search for ' + $routeParams.query);
  } else {
    if ($routeParams.tag) {
      params.tag = $routeParams.tag;
      $scope.datas = Post.tag(params);
      $scope.meta.setTitle($routeParams.tag);
      $scope.prevLink = '/#!/tag/' + ($scope.datas.currentPage - 1);
      $scope.nextLink = '/#!/tag/' + ($scope.datas.currentPage + 1);
    } else if ($routeParams.category) {
      params.category = $routeParams.category;
      $scope.datas = Post.category(params);
      $scope.meta.setTitle($routeParams.category);
      $scope.prevLink = '/#!/category/' + ($scope.datas.currentPage - 1);
      $scope.nextLink = '/#!/category/' + ($scope.datas.currentPage + 1);
    } else {
      $scope.datas = Post.index(params);
      $scope.meta.setTitle('Articles');
      $scope.prevLink = '/#!/page/' + ($scope.datas.currentPage - 1);
      $scope.nextLink = '/#!/page/' + ($scope.datas.currentPage + 1);
    }
  }

  $scope.$on('post:refresh', function() {
    console.log('logged in');
  });

}]);