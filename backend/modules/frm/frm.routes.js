const express = require('express');
const resumeController = require('./resume/resume.controller');
const skillGapController = require('./skillGap/skillGap.controller');
const coursesController = require('./courses/courses.controller');
const negotiationController = require('./negotiation/negotiation.controller');

const router = express.Router();

// F1
router.post(
  '/resume/upload',
  (req, res, next) => {
    // Support both multipart and JSON
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
      return resumeController.uploadMiddleware(req, res, (err) => {
        if (err) {
          return res.status(400).json({
            error: 'bad_request',
            message: err.message || 'File upload failed.',
          });
        }
        return resumeController.uploadResume(req, res);
      });
    }
    return resumeController.uploadResume(req, res);
  }
);

// F2
router.get('/skill-gap', skillGapController.getSkillGap);
router.get('/roles', skillGapController.listRoles);

// F3
router.get('/courses', coursesController.getCourses);

// F4
router.post('/negotiation/start', negotiationController.start);
router.post('/negotiation/:sessionId/message', negotiationController.message);
router.post('/negotiation/:sessionId/end', negotiationController.end);

module.exports = router;
