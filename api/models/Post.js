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
    categories: 'array',
    status: {
      type: 'string',
      in : ['published', 'draft']
    }
  },

  beforeCreate: function(values, next) {

    // Set the status if it wasn't sent
    if (values.status === null || values.status === '') {
      values.status = 'draft';
    }

    next();
  },

  afterValidation: function(values, next) {

    // Generate and sanitanize slug
    var getSlug = require('speakingurl');
    if (values.slug === null || values.slug === '') {
      values.slug = values.title;
    }
    values.slug = getSlug(values.slug);

    // Set the status if it wasn't sent
    if (values.status === null || values.status === '') {
      values.status = 'draft';
    }

    next();
  }

};
