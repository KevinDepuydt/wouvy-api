import env from '../config/env';

const roles = env.memberRoles;

export const prepareMember = (member) => {
  const m = member ? member.toJSON() : {};

  // is member moderator of the workflows
  m.isAdmin = member.role === roles[2];
  m.isModerator = member.isAdmin || member.role === roles[1];

  return m;
};
