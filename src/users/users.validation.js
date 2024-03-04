import Joi from "joi"

export const getValidateUsers = {
  query: Joi.object().keys({
    username: Joi.string()
  })
}

export const getValidateUser = {
  params: Joi.object().keys({
    username: Joi.string().required()
  })
}
