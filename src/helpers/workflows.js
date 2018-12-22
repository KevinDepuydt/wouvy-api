import env from '../config/env';

export const prepareWorkflow = (workflow, user) => {
  const wf = workflow ? workflow.toJSON() : {};

  // remove password from workflow
  delete wf.password;

  // custom data that isn't persisted to mongodb
  if (user && wf.user) {
    wf.isOwner = wf.user._id.toString() === user._id.toString();
  }

  // prepare user role
  const role = wf.roles.find(r => r.user._id.toString() === user._id.toString());
  wf.userRole = role ? role.role : env.userRoles.member;

  return wf;
};
