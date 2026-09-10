const skillGapService = require('./skillGap.service');
const { getRoleOptions } = require('./roleRequirements.data');

async function getSkillGap(req, res) {
  try {
    const { skillProfileId, targetRoleId } = req.query;
    if (!skillProfileId || !targetRoleId) {
      return res.status(400).json({
        error: 'bad_request',
        message: 'skillProfileId and targetRoleId query params are required.',
      });
    }

    const result = await skillGapService.getSkillGap({
      userId: req.user.id,
      skillProfileId,
      targetRoleId,
    });

    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      error: err.code || 'server_error',
      message: err.message || 'Skill gap computation failed.',
    });
  }
}

function listRoles(_req, res) {
  return res.status(200).json({ roles: getRoleOptions() });
}

module.exports = { getSkillGap, listRoles };
