/**
 * PostController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

  index: function(req, res) {

    var page = req.param('page') || 1;
    var postsPerPage = req.param('postsPerPage') || 10;
    var options = {
      status: 'published'
    };

    // Add to the options object to support searching
    if (req.param('search')) {
      options = {
        or: []
      };
      var search = req.param('search').split(' ');
      for (var q = 0; q < search.length; q++) {
        options.or.push({
          title: {
            contains: search[q]
          }
        });
        options.or.push({
          body: {
            contains: search[q]
          }
        });
      }
    }

    // Query the model to get the posts
    Post.find(options).done(function(error, posts) {
      if (error) return res.serverError(error);

      Post.find(options)
        .sort('createdAt DESC')
        .paginate({
          page: page,
          limit: postsPerPage
        })
        .done(function(error, posts) {
          res.send({
            totalPosts: posts.length,
            postsPerPage: postsPerPage,
            currentPage: parseInt(page),
            posts: posts
          })
        })
    })


  },


  show: function(req, res) {
    Post.findOne(req.param('id')).done(function(err, post) {
      if (err) return res.serverError(err);
      res.send(post);
    });
  },


  tag: function(req, res) {
    var tag = req.param('tag');

    Post.findByTagsIn(tag).done(function(err, posts) {
      if (err) return res.serverError(error);
      return res.send({
        posts: posts,
        totalPosts: posts.length,
        tag: tag
      });
    });
  },


  category: function(req, res) {
    var category = req.param('category');

    Post.findByCategoriesIn(category).done(function(err, posts) {
      if (err) return res.serverError(error);
      return res.send({
        posts: posts,
        totalPosts: posts.length,
        category: category
      });
    });
  },


  create: function(req, res) {
    Post.create({
      title: req.param('title'),
      slug: req.param('slug'),
      body: req.param('body'),
      tags: req.param('tags'),
      categories: req.param('categories'),
      status: req.param('status')
    }).done(function(error, post) {
      if (error) return res.serverError(error);
      res.send(post);
    });
  },


  update: function(req, res) {
    var id = req.param('id');
    Post.update({
      id: id
    }, {
      title: req.param('title'),
      body: req.param('body'),
      slug: req.param('slug'),
      tags: req.param('tags'),
      categories: req.param('categories'),
      status: req.param('status')
    }, function(error, post) {
      if (error) return res.serverError(error);
      res.send(post);
    });
  },


  destroy: function(req, res) {
    Post.destroy(req.param('id')).done(function(error) {
      if (error) return res.serverError(error);
      res.send({});
    });
  },

};
