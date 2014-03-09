/**
 * Post
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    title: {
      type: 'string',
      required: true
    },
    slug: 'string',
    body: {
      type: 'text',
      required: true
    },
    tags: 'array',
    categories: 'array'
  },

  afterValidation: function(values, next) {
    var getSlug = require('speakingurl');

    // Generate and sanitanize slug
    if (values.slug === null || values.slug === '') {
      values.slug = values.title;
    }
    values.slug = getSlug(values.slug);

    next();
  }

};
