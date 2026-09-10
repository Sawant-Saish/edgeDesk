const coursesService = require('./courses.service');
const { isValidSkillId } = require('../skillGap/skillTaxonomy.data');

function getCourses(req, res) {
  try {
    const { skillId } = req.query;
    if (!skillId) {
      return res.status(400).json({
        error: 'bad_request',
        message: 'skillId query param is required.',
      });
    }
    if (!isValidSkillId(skillId)) {
      return res.status(400).json({
        error: 'invalid_skill',
        message: 'skillId must exist in the skill taxonomy.',
      });
    }

    const courses = coursesService.getCoursesForSkill(skillId);
    return res.status(200).json({ skillId, courses });
  } catch (err) {
    return res.status(500).json({
      error: 'server_error',
      message: err.message || 'Course lookup failed.',
    });
  }
}

module.exports = { getCourses };
