import env from '../config/env';

/**
 * List of Rights
 */
const list = (req, res) => res.json(env.rights);

export { list };
