export const prepareWorkflow = (workflow, user) => {
  const wf = workflow ? workflow.toJSON() : {};

  // remove password from workflow
  delete wf.password;

  // custom data that isn't persisted to mongodb
  if (user && wf.owner) {
    wf.isOwner = wf.owner._id.toString() === user._id.toString();
  }

  return wf;
};
