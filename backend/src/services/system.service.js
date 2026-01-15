/**
 * System Service - Business logic for system configuration
 */

const systemConfigRepository = require('../repositories/system-config.repository');

class SystemService {
  /**
   * Get system configuration
   */
  async getConfig() {
    return await systemConfigRepository.getMergedConfig();
  }

  /**
   * Update system configuration
   * @param {Object} updateData - Configuration data
   * @param {number} updatedBy - Staff ID of updater
   */
  async updateConfig(updateData, updatedBy) {
    // Validate required fields
    if (!updateData.company_name) {
      throw new Error('Company name is required');
    }

    // Extract and prepare company info
    const companyInfo = {
      company_name: updateData.company_name,
      company_address: updateData.company_address,
      company_phone: updateData.company_phone,
      company_email: updateData.company_email,
    };

    // Extract and prepare business config
    const businessConfig = {
      working_hours: updateData.working_hours,
      appointment_duration_default: updateData.appointment_duration_default,
    };

    // Update configurations
    await systemConfigRepository.update('company_info', companyInfo, updatedBy);
    await systemConfigRepository.update(
      'business_config',
      businessConfig,
      updatedBy
    );

    // Update notification settings if provided
    if (updateData.notification_settings) {
      await systemConfigRepository.update(
        'notification_settings',
        updateData.notification_settings,
        updatedBy
      );
    }

    // Return updated config
    return await systemConfigRepository.getMergedConfig();
  }
}

module.exports = new SystemService();
