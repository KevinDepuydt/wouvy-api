export const getErrorMessage = (error) => {
  console.log(error);
  const errorMessages = [];
  if (error.errors) {
    const keys = Object.keys(error.errors);
    for (const key of keys) {
      const message = error.errors[key].message;
      if (message.length <= 200) {
        errorMessages.push(error.errors[key].message);
      }
    }
  }
  if (errorMessages.length > 0) {
    return errorMessages.join('\n');
  }
  return 'Oups! Something went wrong';
};

export const errorHandler = err => ({ message: getErrorMessage(err) });
