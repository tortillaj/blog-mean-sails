'use strict';


//
// Filters
// ---------------------------

angular.module('blog.filters', [])
    .filter('timeago', function () {
      return function (date) {
        return moment(date).fromNow();
      };
    })

    .filter('hyphensToSpaces', function () {
      return function (text) {
        return text.replace('-', ' ');
      }
    });