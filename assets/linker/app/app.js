var resolve = {

  getCsrfToken: function($q, $http, Globals) {
    var defer = $q.defer();

    if ($http.defaults.headers.common['x-csrf-token']) {
      defer.resolve('getCsrfToken');
    } else {
      $http({
        method: 'GET',
        url: '/csrfToken'
      })
        .success(function(data, status, headers, config) {
          $http.defaults.headers.common['x-csrf-token'] = data._csrf;
          Globals.csrfToken = data._csrf;
          defer.resolve('getCsrfToken');
        })
        .error(function(data, status, headers, config) {
          defer.reject('getCsrfToken');
        });
    }

    return defer.promise;
  }
};

var blog = angular.module('Blog', [
    'ngRoute',
    'ngSanitize',
    'ngTagsInput',
    'angular-growl',
    'mm.foundation',
    'blog.filters',
    'blog.services',
    'blog.directives'
  ]).constant('Globals', {
    apiPrefix: '/api',
    csrfToken: null
  }).config([
    '$locationProvider',
    '$routeProvider',
    'growlProvider',
    function ($locationProvider, $routeProvider, growlProvider) { 
      $locationProvider.html5Mode(false).hashPrefix('!');

      $routeProvider.when('/', {
          templateUrl: '/partials/post/index.html',
          controller: 'PostIndexCtrl',
          resolve: resolve
        })
        .when('/page/:page', {
          templateUrl: '/partials/post/index.html',
          controller: 'PostIndexCtrl',
          resolve: resolve
        })
        .when('/post/create', {
          templateUrl: '/partials/post/edit.html',
          controller: 'PostEditCtrl',
          needAuthentication: true,
          resolve: resolve
        })
        .when('/post/:id/edit', {
          templateUrl: '/partials/post/edit.html',
          controller: 'PostEditCtrl',
          needAuthentication: true,
          resolve: resolve
        })
        .when('/search/:query', {
          templateUrl: '/partials/post/index.html',
          controller: 'PostIndexCtrl',
          resolve: resolve
        })
        .when('/:slug/:id', {
          templateUrl: '/partials/post/show.html',
          controller: 'PostShowCtrl',
          resolve: resolve
        })
        .otherwise({
          templateUrl: '/partials/404.html'
        });

      growlProvider.globalTimeToLive(3000);
      growlProvider.globalEnableHtml(true);
    }
  ]).run([
    '$rootScope',
    '$http',
    '$templateCache',
    'Globals',
    function($rootScope, $http, $templateCache, Globals) {

      // At start, define if user is already authenticated or not
      $rootScope.isAuthenticated = false;
      $http
        .get(Globals.apiPrefix + '/users/me')
        .success(function(user) {
          $rootScope.user = user;
          $rootScope.isAuthenticated = true;
        })
        .error(function(err) {
          $rootScope.isAuthenticated = false;
        });

      // Customized Angular Tags Input template to fit Semantic UI
      $templateCache.put('ngTagsInput/tags-input.html',
        '<div class="ngTagsInput" tabindex="-1" ng-class="options.customClass" ti-transclude-append=""><div class="tags" ng-class="{focused: hasFocus}"><ul class="tag-list"><li class="ui label tag-item" ng-repeat="tag in tags" ng-class="getCssClass($index)"><span>{{tag}}</span> <i class="delete icon" ng-click="remove($index)"></i></li></ul><input class="tag-input" placeholder="{{options.placeholder}}" maxlength="{{options.maxLength}}" tabindex="{{options.tabindex}}" ng-model="newTag" ng-change="newTagChange()" ti-autosize=""></div></div>'
      );

      $templateCache.put('ngTagsInput/auto-complete.html',
        '<div class="autocomplete" ng-show="suggestionList.visible"><ul class="suggestion-list"><li class="suggestion-item" ng-repeat="item in suggestionList.items | limitTo:options.maxResultsToShow" ng-class="{selected: item == suggestionList.selected}" ng-click="addSuggestion()" ng-mouseenter="suggestionList.select($index)" ng-bind-html="highlight(item)"></li></ul></div>'
      );
    }
  ]);