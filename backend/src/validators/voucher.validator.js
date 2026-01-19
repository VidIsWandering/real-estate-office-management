// src/validators/voucher.validator.js

const Joi = require('joi');

/**
 * Schema cho query parameters khi list vouchers
 */
const listVouchersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  contractId: Joi.number().integer().positive().optional().allow('', null),
  type: Joi.string().valid('receipt', 'payment').optional().allow('', null),
  status: Joi.string().valid('created', 'confirmed').optional().allow('', null),
  paymentMethod: Joi.string().valid('bank_transfer', 'cash').optional().allow('', null),
  fromDate: Joi.date().iso().optional().allow('', null),
  toDate: Joi.date().iso().optional().allow('', null)
    .when('fromDate', {
      is: Joi.exist(),
      then: Joi.date().min(Joi.ref('fromDate')).messages({
        'date.min': 'toDate phải sau fromDate'
      })
    }),
  search: Joi.string().max(100).optional().allow('', null),
  sortBy: Joi.string().valid('payment_time', 'amount', 'created_at').default('created_at'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

/**
 * Schema cho tạo voucher mới
 */
const createVoucherSchema = Joi.object({
  contractId: Joi.number().integer().positive().required().messages({
    'any.required': 'contractId là bắt buộc',
    'number.base': 'contractId phải là số',
    'number.positive': 'contractId phải là số dương'
  }),
  type: Joi.string().valid('receipt', 'payment').required().messages({
    'any.required': 'type là bắt buộc',
    'any.only': 'type phải là receipt hoặc payment'
  }),
  party: Joi.string().max(200).required().messages({
    'any.required': 'party là bắt buộc',
    'string.max': 'party không được quá 200 ký tự'
  }),
  paymentTime: Joi.date().iso().required().messages({
    'any.required': 'paymentTime là bắt buộc',
    'date.format': 'paymentTime phải đúng định dạng ISO'
  }),
  amount: Joi.number().positive().required().messages({
    'any.required': 'amount là bắt buộc',
    'number.positive': 'amount phải lớn hơn 0'
  }),
  paymentMethod: Joi.string().valid('bank_transfer', 'cash').required().messages({
    'any.required': 'paymentMethod là bắt buộc',
    'any.only': 'paymentMethod phải là bank_transfer hoặc cash'
  }),
  paymentDescription: Joi.string().max(500).optional().allow('', null),
  attachments: Joi.array().items(Joi.number().integer().positive()).optional()
});

/**
 * Schema cho cập nhật voucher
 */
const updateVoucherSchema = Joi.object({
  party: Joi.string().max(200).optional(),
  paymentTime: Joi.date().iso().optional(),
  amount: Joi.number().positive().optional().messages({
    'number.positive': 'amount phải lớn hơn 0'
  }),
  paymentMethod: Joi.string().valid('bank_transfer', 'cash').optional(),
  paymentDescription: Joi.string().max(500).optional().allow('', null),
  attachments: Joi.array().items(Joi.number().integer().positive()).optional()
}).min(1).messages({
  'object.min': 'Phải có ít nhất một trường để cập nhật'
});

/**
 * Schema cho thống kê
 */
const statsSchema = Joi.object({
  fromDate: Joi.date().iso().optional().allow('', null),
  toDate: Joi.date().iso().optional().allow('', null),
  contractId: Joi.number().integer().positive().optional().allow('', null)
});

/**
 * Schema cho ID parameter
 */
const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'any.required': 'ID là bắt buộc',
    'number.base': 'ID phải là số',
    'number.positive': 'ID phải là số dương'
  })
});

/**
 * Schema cho contractId parameter
 */
const contractIdParamSchema = Joi.object({
  contractId: Joi.number().integer().positive().required().messages({
    'any.required': 'contractId là bắt buộc',
    'number.base': 'contractId phải là số',
    'number.positive': 'contractId phải là số dương'
  })
});

/**
 * Middleware validate request
 */
const validate = (schema, property = 'query') => {
  return (req, res, next) => {
    const dataToValidate = property === 'params' ? req.params : 
                          property === 'body' ? req.body : req.query;
    
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Dữ liệu không hợp lệ',
          details: errors
        }
      });
    }

    // Replace with validated value
    if (property === 'params') {
      req.params = value;
    } else if (property === 'body') {
      req.body = value;
    } else {
      req.query = value;
    }

    next();
  };
};

module.exports = {
  validateListVouchers: validate(listVouchersSchema, 'query'),
  validateCreateVoucher: validate(createVoucherSchema, 'body'),
  validateUpdateVoucher: validate(updateVoucherSchema, 'body'),
  validateStats: validate(statsSchema, 'query'),
  validateIdParam: validate(idParamSchema, 'params'),
  validateContractIdParam: validate(contractIdParamSchema, 'params')
};
