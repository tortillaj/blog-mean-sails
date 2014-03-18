/**
 * UploadController
 *
 * @module      :: Controller
 * @description  :: A set of functions called `actions`.
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

  index: function (req, res) {
    var fs = require('fs'),
      path = require('path'),
      aws = require('aws-sdk');

    var fileBuffer = fs.readFileSync(req.files.file.path);
    var metaData = req.files.file.headers['content-type'];

    // Config AWS
    aws.config.update({
      accessKeyId: sails.config.aws.accessKeyId,
      secretAccessKey: sails.config.aws.secretAccessKey
    });

    var s3 = new aws.S3({
      endpoint: sails.config.aws.endPoint
    });

    var params = {
      Bucket: sails.config.aws.bucket,
      ACL: 'public-read',
      Key: req.files.file.originalFilename,
      Body: fileBuffer
    };

    // Store image into aws bucket
    s3.putObject(params, function (err, data) {
      if (err) {
        res.serverError(err);
      } else {
        console.dir(data);
        // Return link to the image
        res.send({
          url: 'https://' + sails.config.aws.endPoint + '/' + sails.config.aws.bucket + '/' + req.files.file.originalFilename
        });
      }
    });
  },

  send: function(req, res) {
    var Imager = require('imager');
    var imagerConfig = sails.config.imager;
    var imager = new Imager(imagerConfig, 'S3');

    // add a field to support imager
    req.files.file.type = req.files.file.headers['content-type'];

    imager.upload([req.files.file], function(error, cdnUri, uploaded) {
      if (error) res.serverError(error);
      res.send({
        uploaded: uploaded,
        cdnUri: cdnUri
      });
    }, 'items');
  }

};
