import _ from 'lodash';
import multer from 'multer';
import { S3 } from 'aws-sdk';
import env from '../config/env';

const allowedTypes = [
  'application/pdf',
  'application/zip',
  'application/x-compressed-zip',
  'text/plain',
  'application/vnd.ms-powerpointtd',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
  'application/vnd.openxmlformats-officedocument.presentationml.template',
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/gif',
  'application/mswordg',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
];
// allowed files filter
const allowedFilesFilter = (req, file, cb) => {
  if (allowedTypes.indexOf(file.mimetype) === -1) {
    const err = new Error("Ce type de fichier n'est pas supporté par l'application.");
    err.code = 'UNSUPPORTED_MEDIA_TYPE';
    return cb(err, false);
  }
  cb(null, true);
};

// Multer upload configured as middleware
const storage = multer.memoryStorage();
const upload = multer({ storage, fileFilter: allowedFilesFilter });

// AWS S3 client
const s3Client = new S3({
  accessKeyId: env.aws.accessKey,
  secretAccessKey: env.aws.secretAccessKey,
  region: env.aws.region,
});

/**
 * AWS S3 Upload file
 */
const awsUploadFile = (req, res) => {
  const path = _.reduce(req.query, (acc, val, key) => `${acc.length > 0 ? `${acc}/` : ''}${key}${val ? `/${val}` : ''}`, '');
  const params = {
    Bucket: env.aws.bucket,
    Key: `${path}/${encodeURI(req.file.originalname)}`,
    Body: req.file.buffer,
  };
  s3Client.upload(params, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send(data.Location);
  });
};

/**
 * AWS S3 Delete object
 */
const awsDeleteObject = (req, res) => {
  if (!req.query.path) {
    return res.status(500).send({ message: 'missing path parameter' });
  }

  const params = {
    Bucket: env.aws.bucket,
    Key: req.query.path.toString().replace('https://wouvy-uploads.s3.eu-west-1.amazonaws.com/', ''),
  };
  s3Client.deleteObject(params, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send(data);
  });
};

export { upload, awsUploadFile, awsDeleteObject };
