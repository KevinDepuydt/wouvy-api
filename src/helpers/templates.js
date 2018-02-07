import env from '../config/env';

export const getImagePath = name => `${env.appUrl}/static/${name}`;
