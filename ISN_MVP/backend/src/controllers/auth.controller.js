import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

/**
 * Simple client credentials token endpoint stub.
 * In production, validate client_id/client_secret against DB and issue JWT.
 */
export async function token(req, res) {
  const { client_id, client_secret } = req.body;
  if (!client_id || !client_secret) {
    return res.status(400).json({ code: 'ERR_INVALID_REQUEST', message: 'client_id and client_secret required', trace_id: uuidv4() });
  }
  // This is a stub: replace with DB lookup & secret verification
  const payload = { sub: client_id, tenant_id: client_id, scopes: ['jobs.read','jobs.write'] };
  const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY || 'dev-secret', { algorithm: 'HS256', expiresIn: '12h' });
  return res.json({ access_token: token, token_type: 'Bearer', expires_in: 43200 });
}

export async function whoami(req, res) {
  // If auth middleware already populated req.tenant and req.scopes
  return res.json({ tenant: req.tenant || null, scopes: req.scopes || [] });
}