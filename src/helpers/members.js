import env from '../config/env';

const roles = env.userRoles;

export const prepareMember = (member) => {
  const m = member ? member.toJSON() : {};

  // is member moderator of the workflows
  m.isAdmin = member.role === roles.admin;
  m.isModerator = member.isAdmin || member.role === roles.moderator;

  return m;
};
