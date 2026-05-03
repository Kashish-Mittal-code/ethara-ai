const send = (res, { success = true, message = '', data = {}, status = 200 }) =>
  res.status(status).json({ success, message, data });

module.exports = { send };
