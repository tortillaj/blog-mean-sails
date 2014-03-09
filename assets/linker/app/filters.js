'use strict';


//
// Filters
// ---------------------------

angular.module('blog.filters', [])
  .filter('timeago', function () {
    return function(date){
      return moment(date).fromNow();
    };
  });