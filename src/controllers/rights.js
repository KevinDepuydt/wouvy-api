import env from '../config/env';

/**
 * List of Rights
 */
const list = (req, res) => res.jsonp(env.rights);

export { list };
