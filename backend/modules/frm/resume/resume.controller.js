const multer = require('multer');
const resumeService = require('./resume.service');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are accepted'));
    }
  },
});

const uploadMiddleware = upload.single('file');

async function uploadResume(req, res) {
  try {
    let text = '';
    let sourceType = 'pasted_text';

    if (req.file) {
      sourceType = 'pdf';
      text = await resumeService.extractTextFromPdf(req.file.buffer);
      if (!text || text.length < 40) {
        return res.status(422).json({
          error: 'extraction_failed',
          message:
            'Could not confidently extract skills. Try pasting text instead of PDF.',
        });
      }
    } else if (req.body?.pastedText) {
      text = req.body.pastedText;
      sourceType = 'pasted_text';
    } else if (typeof req.body === 'object' && req.body.pastedText === undefined && req.is('application/json')) {
      text = req.body.pastedText || '';
    }

    // Support JSON body when no multipart file
    if (!req.file && req.body && typeof req.body.pastedText === 'string') {
      text = req.body.pastedText;
      sourceType = 'pasted_text';
    }

    if (!text) {
      return res.status(400).json({
        error: 'bad_request',
        message: 'Provide a PDF file or JSON { pastedText }.',
      });
    }

    const result = await resumeService.processResumeText({
      userId: req.user.id,
      text,
      sourceType,
    });

    return res.status(200).json(result);
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({
      error: err.code || 'server_error',
      message: err.message || 'Unexpected error during resume processing.',
    });
  }
}

module.exports = {
  uploadMiddleware,
  uploadResume,
};
