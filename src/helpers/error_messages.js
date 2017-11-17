export const getErrorMessage = (error) => {
  const errorMessages = [];
  if (error.errors) {
    const keys = Object.keys(error.errors);
    for (const key of keys) {
      errorMessages.push(error.errors[key].message);
    }
  }
  console.log(errorMessages);
  if (errorMessages.length > 0) {
    return errorMessages.join('\n');
  }
  return 'Oups! Something went wrong';
};
