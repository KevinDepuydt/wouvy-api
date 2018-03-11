import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'public', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // ensure uniqueness of filename
    cb(null, `${path.basename(file.originalname, ext)}-${Date.now()}${ext}`);
  },
});

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

const upload = multer({ storage, fileFilter: allowedFilesFilter });

/**
 * Upload a file
 */
const uploadFile = (req, res) => {
  const uploader = upload.single('file');
  uploader(req, res, (err) => {
    if (err) {
      return res.status(400).send(err);
    }
    res.status(200).send(req.file.filename);
  });
};

/**
 * Download file
 */
const getUpload = (req, res) => {
  res.download(`./public/uploads/${req.params.filename}`);
};

export { uploadFile, getUpload };
