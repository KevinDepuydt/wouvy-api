export const prepareForClient = (workflow, user) => {
  const wf = workflow ? workflow.toJSON() : {};

  // remove password from workflow
  delete wf.password;

  // custom data that isn't persisted to mongodb
  if (user && wf.user) {
    wf.isOwner = wf.user._id.toString() === user._id.toString();
  }

  return wf;
};
