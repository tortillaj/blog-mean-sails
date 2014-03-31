blog.controller('PostIndexCtrl', ['$scope', '$routeParams', 'growl', 'Post', function ($scope, $routeParams, growl, Post) {

  var page = $routeParams.page || 1;
  var postsPerPage = $routeParams.postsPerPage || 10;

  $scope.params = { page: page, postsPerPage: postsPerPage };

  if ($routeParams.query) {
    $scope.params.query = $routeParams.query;
  }
  else {
    if ($routeParams.tag) {
      $scope.params.tag = $routeParams.tag;
    }
    else if ($routeParams.category) {
      $scope.params.category = $routeParams.category;
    }
  }


  $scope.getPosts = function() {
    $scope.datas = Post.index($scope.params, function (postData) {
      $scope.meta.setTitle('Articles');
      $scope.firstPost = postData.firstPost[0];
      $scope.posts = postData.posts;
      $scope.prevLink = '/#!/page/' + (postData.currentPage - 1);
      $scope.nextLink = '/#!/page/' + (postData.currentPage + 1);
    });
  };

  $scope.getSearchPosts = function() {
    $scope.datas = Post.search($scope.params, function (postData) {
      $scope.meta.setTitle('Search for ' + $routeParams.query);
      $scope.firstPost = postData.firstPost[0];
      $scope.posts = postData.posts;
      $scope.prevLink = '/#!/search?q=' + $routeParams.query + '&page=' + (postData.currentPage - 1);
      $scope.nextLink = '/#!/search?q=' + $routeParams.query + '&page=' + (postData.currentPage + 1);
    });
  };

  $scope.getTagPosts = function() {
    $scope.datas = Post.tag($scope.params, function (postData) {
      $scope.meta.setTitle($routeParams.tag);
      $scope.firstPost = postData.posts[0];
      $scope.posts = postData.posts;
      $scope.prevLink = '/#!/tag/' + $routeParams.tag + '&page=' + (postData.currentPage - 1);
      $scope.nextLink = '/#!/tag/' + $routeParams.tag + '&page=' + (postData.currentPage + 1);
    });
  };

  $scope.getCategoryPosts = function() {
    $scope.datas = Post.category($scope.params, function (postData) {
      $scope.meta.setTitle($routeParams.category);
      $scope.firstPost = postData.posts[0];
      $scope.posts = postData.posts;
      $scope.prevLink = '/#!/category/' + $routeParams.category + '&page=' + (postData.currentPage - 1);
      $scope.nextLink = '/#!/category/' + $routeParams.category + '&page=' + (postData.currentPage + 1);
    });
  };




  $scope.whichPosts = function() {
    if ($scope.params.query) {
      $scope.getSearchPosts();
    }
    else {
      if ($scope.params.tag) {
        $scope.getTagPosts();
      }
      else if ($scope.params.category) {
        $scope.getCategoryPosts();
      }
      else {
        $scope.getPosts();
      }
    }
  };

  $scope.loadPosts = function(direction, query) {
    switch (direction) {
      case 'previous':
        $scope.params.page--;
        break;
      case 'next':
        $scope.params.page++;
        break;
      case 'first':
        $scope.params.page = 1;
        break;
    }

    if (typeof query !== 'undefined') {
      jQuery.extend($scope.params, query);
    }

    $scope.whichPosts();
  };

  $scope.whichPosts();

  $scope.$on('post:refresh', function () {
    $scope.getPosts();
  });

}]);