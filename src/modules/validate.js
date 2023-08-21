import httpStatus from "http-status";
import Joi from "joi";

const validate = (schema) => async (req, res, next) => {
  const validSchema = Joi.object(schema);
  const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };

  // eslint-disable-next-line no-unused-vars
  const { error, value } = validSchema.validate(req.body, options);
  // console.log(value);
  // console.log(req.body)
  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(", ");
    return res.status(httpStatus.BAD_REQUEST).json({ message: errorMessage });
  }
  // req.body = value;
  return next();
};

export default validate;
