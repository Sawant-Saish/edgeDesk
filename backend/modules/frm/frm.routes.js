const express = require('express');
const resumeController = require('./resume/resume.controller');
const skillGapController = require('./skillGap/skillGap.controller');
const coursesController = require('./courses/courses.controller');
const negotiationController = require('./negotiation/negotiation.controller');

const router = express.Router();

const handleUpload = (req, res, next) => {
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
};

// F1 Resume Upload — matches any URL path variation
router.post(['/resume/upload', '/upload', '/api/frm/resume/upload', '/api/resume/upload'], handleUpload);

// F2 Skill Gap & Roles
router.get(['/skill-gap', '/api/frm/skill-gap'], skillGapController.getSkillGap);
router.get(['/roles', '/api/frm/roles'], skillGapController.listRoles);

// F3 Courses
router.get(['/courses', '/api/frm/courses'], coursesController.getCourses);

// F4 Negotiation
router.post(['/negotiation/start', '/start', '/api/frm/negotiation/start'], negotiationController.start);
router.post(['/negotiation/:sessionId/message', '/:sessionId/message', '/message', '/api/frm/negotiation/:sessionId/message'], negotiationController.message);
router.post(['/negotiation/:sessionId/end', '/:sessionId/end', '/end', '/api/frm/negotiation/:sessionId/end'], negotiationController.end);

module.exports = router;
