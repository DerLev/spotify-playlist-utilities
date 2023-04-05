import Joi from 'joi'

interface Config {
  redis: {
    host: string
    user: string
    password: string
  }
}

export const configSchema = Joi.object({
  redis: Joi.object({
    host: Joi.string().regex(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{4,5}$/).required(),
    user: Joi.string().required(),
    password: Joi.string().required()
  }).required()
})

export type { Config }
