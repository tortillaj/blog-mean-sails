'use strict';

angular.module('blog.services', ['ngResource'])

// service for posts
  .factory('Post', ['$resource', 'Globals',
    function ($resource, Globals) {
      return $resource(Globals.apiPrefix + '/posts/:id', {
        slug: "@_id"
      }, {
        'index': {
          method: 'GET',
          params: {
            page: 'page'
          }
        },
        'show': {
          method: 'GET'
        },
        'create': {
          method: 'POST'
        },
        'update': {
          method: 'PUT'
        },
        'destroy': {
          method: 'DELETE'
        },
        'search': {
          method: 'GET',
          action: 'search',
          params: { query: 'search', page: 'page' }
        }
      });
    }
])

// service for authenticating
  .factory('Auth', ['$http', '$q', '$route', '$rootScope', '$location', 'Globals', function ($http, $q, $route, $rootScope, $location, Globals) {

    $rootScope.$on('$routeChangeSuccess', function (next, current) {
      var authRequired = $route.current && $route.current.needAuthentication;

      if (authRequired && !$rootScope.isAuthenticated) {
        $location.url('/');
      }
    });

    return {

      // Login
      login: function (user) {
        var defer = $q.defer();
        $http({
          method: 'POST',
          url: Globals.apiPrefix + '/users/login',
          data: user
        })
          .success(function (data, status, headers, config) {
            defer.resolve(data, status);
          })
          .error(function (data, status, headers, config) {
            defer.reject(data, status);
          });
        return defer.promise;
      },

      // Logout
      logout: function () {
        var defer = $q.defer();
        $http({
          method: 'GET',
          url: Globals.apiPrefix + '/users/logout'
        })
          .success(function (data, status, headers, config) {
            defer.resolve(data, status);
          })
          .error(function (data, status, headers, config) {
            defer.reject(data, status);
          });
        return defer.promise;
      }
    };
  }]);
