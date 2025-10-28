// src/lib/utils/validation.js
export const validatePollData = (data) => {
  const errors = {};

  if (!data.question || data.question.trim().length < 3) {
    errors.question = "Question must be at least 3 characters long";
  }

  if (
    !data.options ||
    !Array.isArray(data.options) ||
    data.options.length < 2
  ) {
    errors.options = "Poll must have at least 2 options";
  } else {
    const validOptions = data.options.filter(
      (opt) => opt.text && opt.text.trim()
    );
    if (validOptions.length < 2) {
      errors.options = "Poll must have at least 2 valid options";
    }

    data.options.forEach((option, index) => {
      if (!option.text || option.text.trim().length === 0) {
        errors[`option_${index}`] = "Option text cannot be empty";
      } else if (option.text.trim().length > 200) {
        errors[`option_${index}`] = "Option text cannot exceed 200 characters";
      }

      if (option.description && option.description.length > 500) {
        errors[`option_desc_${index}`] =
          "Option description cannot exceed 500 characters";
      }
    });
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
