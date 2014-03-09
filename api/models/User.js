/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    uid: {
      type: 'integer',
      index: true
    },
    username: {
      type: 'string',
      index: true,
      required: true
    },
    email: {
      type: 'string',
      email: true,
      index: true,
      required: true
    },
    password: {
      type: 'string',
      required: true
    },
    firstName: 'string',
    lastName: 'string',

    toJSON: function() {
      var u = this.toObject();
      delete u.password;
      return u;
    }
  },

  beforeCreate: function(values, next) {

    // Hash password
    var bcrypt = require('bcrypt');
    bcrypt.hash(values.password, 10, function(error, hash) {
      if (error) return next(error);
      values.password = hash;
      next();
    });
  }

};
