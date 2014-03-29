'use strict';

angular.module('blog.services', ['ngResource'])

// service for posts
    .factory('Post', ['$resource', 'Globals', '$rootScope',
      function ($resource, Globals, $rootScope) {
        return $resource(Globals.apiPrefix + '/posts/:id', {
          slug: "@_id"
        }, {
          'index': {
            method: 'GET'
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
            params: { query: 'search' }
          },
          'tag': {
            method: 'GET',
            action: 'tag',
            params: { tag: 'tag' }
          },
          'category': {
            method: 'GET',
            action: 'category',
            params: { category: 'category' }
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

      $rootScope.$on('auth:user-login', function () {
        $rootScope.isAuthenticated = true;
        $rootScope.$broadcast('post:refresh');
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
                $rootScope.$broadcast('post:refresh');
              })
              .error(function (data, status, headers, config) {
                defer.reject(data, status);
              });
          return defer.promise;
        }
      };
    }])

// a service for uploading files
    .factory('$fileUpload', ['$http', '$q', 'Globals', function ($http, $q, Globals) {
      var acceptedTypes = ['image/png', 'image/jpeg', 'image/gif'];
      var formatData = function (file) {
        var formData = new FormData();
        formData.append('file', file);
        return formData;
      };

      return {
        upload: function (file) {
          var defer = $q.defer();

          if (acceptedTypes.indexOf(file.type) > -1) {
            $http({
              method: 'POST',
              url: Globals.apiPrefix + '/upload/send',
              data: formatData(file),
              headers: {
                'Content-Type': undefined
              },
              transformRequest: angular.identity
            })
                .success(function (data, status, headers, config) {
                  if (status === '400') {
                    defer.reject('Something went wrong, please check if AWS is correctly defined.');
                  } else {
                    defer.resolve(data.cdnUri + '/original_' + data.uploaded[0]);
                  }
                })
                .error(function (data, status, headers, config) {
                  defer.reject(status);
                });
          } else {
            defer.reject('Wrong file type');
          }
          return defer.promise;
        }
      }
    }])

// service for socket.io
    .factory('socket', function ($rootScope) {
      var socket = io.connect();
      return {
        on: function (eventName, callback) {
          socket.on(eventName, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              callback.apply(socket, args);
            });
          });
        },
        emit: function (eventName, data, callback) {
          socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              if (callback) {
                callback.apply(socket, args);
              }
            });
          })
        }
      };
    });