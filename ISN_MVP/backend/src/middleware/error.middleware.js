export function errorMiddleware(err, req, res, next){
  const trace_id = req.headers['x-trace-id'] || Math.random().toString(36).slice(2);
  const status = err.status || 500;
  const payload = { code: err.code || 'ERR_INTERNAL', message: err.message || 'Internal Error', trace_id, details: err.details || {} };
  res.status(status).json(payload);
}
