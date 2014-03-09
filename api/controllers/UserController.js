/**
 * UserController
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

  me: function(req, res) {
    if (!req.user) return res.send(401);
    return res.send(req.user);
  },

  logout: function(req, res) {
    req.logout();

    return res.send({
      status: 'success'
    });
  },

  login: function(req, res) {
    var passport = require('passport');

    passport.authenticate('local', function(error, user, info) {
      if (error) return res.serverError(error);
      if (!user) return res.send({
        message: "User not found"
      }, 404);

      req.logIn(user, function(error) {
        if (error) res.serverError(error);
        return res.send(user);
      });
    })(req, res);
  }

}
