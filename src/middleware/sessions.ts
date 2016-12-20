import config from "../config";

module.exports = (req, res, next) => {
  req.sessionId = req.get(config.app.hermet_session_header) || 'default';
  next();
};
