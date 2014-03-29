blog.controller('PostIndexCtrl', ['$scope', '$routeParams', 'growl', 'Post', function ($scope, $routeParams, growl, Post) {

  var page = $routeParams.page || 1;
  var params = { page: page };

  if ($routeParams.query) {
    params.query = $routeParams.query;

    $scope.datas = Post.search(params, function(postData) {
      $scope.prevLink = '/#!/search?q=' + $routeParams.query + '&page=' + (postData.currentPage - 1);
      $scope.nextLink = '/#!/search?q=' + $routeParams.query + '&page=' + (postData.currentPage + 1);
      $scope.meta.setTitle('Search for ' + $routeParams.query);
    });
  }
  else {
    if ($routeParams.tag) {
      params.tag = $routeParams.tag;

      $scope.datas = Post.tag(params, function(postData) {
        $scope.meta.setTitle($routeParams.tag);
        $scope.prevLink = '/#!/tag/' + $routeParams.tag + '&page=' + (postData.currentPage - 1);
        $scope.nextLink = '/#!/tag/' + $routeParams.tag + '&page=' + (postData.currentPage + 1);
      });
    }
    else if ($routeParams.category) {
      params.category = $routeParams.category;

      $scope.datas = Post.category(params, function(postData) {
        $scope.meta.setTitle($routeParams.category);
        $scope.prevLink = '/#!/category/' + $routeParams.category + '&page=' + (postData.currentPage - 1);
        $scope.nextLink = '/#!/category/' + $routeParams.category + '&page=' + (postData.currentPage + 1);
      });
    }
    else {
      $scope.datas = Post.index(params, function(postData) {
        $scope.meta.setTitle('Articles');
        $scope.prevLink = '/#!/page/' + (postData.currentPage - 1);
        $scope.nextLink = '/#!/page/' + (postData.currentPage + 1);
      });
    }
  }

  $scope.$on('post:refresh', function() {
    $scope.datas = Post.index(params, function(postData) {
      $scope.meta.setTitle('Articles');
      $scope.prevLink = '/#!/page/' + (postData.currentPage - 1);
      $scope.nextLink = '/#!/page/' + (postData.currentPage + 1);
    });
  });

  $scope.loadMore = function() {
    //console.log('time to scroll');
  }

}]);