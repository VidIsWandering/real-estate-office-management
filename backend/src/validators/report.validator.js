// src/validators/report.validator.js

const Joi = require('joi');

const revenueReportSchema = Joi.object({
  fromDate: Joi.date().iso().optional().allow('', null),
  toDate: Joi.date()
    .iso()
    .optional()
    .allow('', null)
    .when('fromDate', {
      is: Joi.exist(),
      then: Joi.date().min(Joi.ref('fromDate')).messages({
        'date.min': 'toDate phải sau fromDate',
      }),
    }),
  staffId: Joi.number().integer().positive().optional().allow('', null),
  location: Joi.string().max(100).optional().allow('', null),
  status: Joi.string()
    .valid(
      'draft',
      'pending_signature',
      'signed',
      'notarized',
      'finalized',
      'cancelled'
    )
    .optional()
    .allow('', null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const agentPerformanceSchema = Joi.object({
  fromDate: Joi.date().iso().optional().allow('', null),
  toDate: Joi.date()
    .iso()
    .optional()
    .allow('', null)
    .when('fromDate', {
      is: Joi.exist(),
      then: Joi.date().min(Joi.ref('fromDate')).messages({
        'date.min': 'toDate phải sau fromDate',
      }),
    }),
  staffId: Joi.number().integer().positive().optional().allow('', null),
});

const debtReportSchema = Joi.object({
  signedOnly: Joi.boolean().default(true),
  customerName: Joi.string().max(100).optional().allow('', null),
  contractId: Joi.number().integer().positive().optional().allow('', null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const dashboardStatsSchema = Joi.object({
  // No parameters needed
});

const recentTransactionsSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(20).default(5),
});

const topPropertiesSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(20).default(5),
  status: Joi.string()
    .valid(
      'created',
      'pending_legal_check',
      'listed',
      'negotiating',
      'transacted',
      'suspended'
    )
    .optional()
    .allow('', null),
});

const exportSchema = Joi.object({
  format: Joi.string().valid('xlsx', 'pdf').required().messages({
    'any.required': 'format là bắt buộc',
    'any.only': 'format phải là xlsx hoặc pdf',
  }),
});

/**
 * Middleware validate request
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Dữ liệu không hợp lệ',
          details: errors,
        },
      });
    }

    req.query = value;
    next();
  };
};

module.exports = {
  validateRevenueReport: validate(revenueReportSchema),
  validateAgentPerformance: validate(agentPerformanceSchema),
  validateDebtReport: validate(debtReportSchema),
  validateDashboardStats: validate(dashboardStatsSchema),
  validateRecentTransactions: validate(recentTransactionsSchema),
  validateTopProperties: validate(topPropertiesSchema),
  validateExport: validate(exportSchema.concat(revenueReportSchema)),
};
