// src/repositories/voucher.repository.js

const { db: pool } = require('../config/database');

class VoucherRepository {
  /**
   * Lấy danh sách vouchers với filter và pagination
   */
  async findAll({
    contractId,
    type,
    status,
    paymentMethod,
    fromDate,
    toDate,
    search,
    sortBy = 'payment_time',
    sortOrder = 'desc',
    page = 1,
    limit = 20,
  }) {
    const offset = (page - 1) * limit;

    // Build ORDER BY clause
    const validSortFields = ['payment_time', 'amount', 'id'];
    const sortField = validSortFields.includes(sortBy)
      ? sortBy
      : 'payment_time';
    const order = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const query = `
      SELECT 
        v.id,
        v.contract_id,
        v.type,
        v.party,
        v.payment_time,
        v.amount,
        v.payment_method,
        v.payment_description,
        v.attachments,
        v.staff_id,
        v.status,
        s.full_name as staff_name,
        s.email as staff_email
      FROM voucher v
      JOIN staff s ON v.staff_id = s.id
      WHERE 
        ($1::bigint IS NULL OR v.contract_id = $1)
        AND ($2::text IS NULL OR v.type::text = $2)
        AND ($3::text IS NULL OR v.status::text = $3)
        AND ($4::text IS NULL OR v.payment_method::text = $4)
        AND ($5::date IS NULL OR v.payment_time::date >= $5)
        AND ($6::date IS NULL OR v.payment_time::date <= $6)
        AND ($7::text IS NULL OR (
          v.party ILIKE '%' || $7 || '%' 
          OR v.payment_description ILIKE '%' || $7 || '%'
        ))
      ORDER BY v.${sortField} ${order}
      LIMIT $8 OFFSET $9
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM voucher v
      WHERE 
        ($1::bigint IS NULL OR v.contract_id = $1)
        AND ($2::text IS NULL OR v.type::text = $2)
        AND ($3::text IS NULL OR v.status::text = $3)
        AND ($4::text IS NULL OR v.payment_method::text = $4)
        AND ($5::date IS NULL OR v.payment_time::date >= $5)
        AND ($6::date IS NULL OR v.payment_time::date <= $6)
        AND ($7::text IS NULL OR (
          v.party ILIKE '%' || $7 || '%' 
          OR v.payment_description ILIKE '%' || $7 || '%'
        ))
    `;

    const params = [
      contractId || null,
      type || null,
      status || null,
      paymentMethod || null,
      fromDate || null,
      toDate || null,
      search || null,
    ];

    const [itemsResult, countResult] = await Promise.all([
      pool.query(query, [...params, limit, offset]),
      pool.query(countQuery, params),
    ]);

    return {
      items: itemsResult.rows,
      total: parseInt(countResult.rows[0].total),
    };
  }

  /**
   * Lấy chi tiết voucher theo ID
   */
  async findById(id) {
    const query = `
      SELECT 
        v.id,
        v.contract_id,
        v.type,
        v.party,
        v.payment_time,
        v.amount,
        v.payment_method,
        v.payment_description,
        v.attachments,
        v.staff_id,
        v.status,
        s.id as staff_id,
        s.full_name as staff_name,
        s.email as staff_email,
        c.id as contract_id,
        c.type as contract_type,
        c.total_value as contract_total_value,
        c.paid_amount as contract_paid_amount,
        c.remaining_amount as contract_remaining_amount,
        c.status as contract_status,
        pa.id as party_a_id,
        pa.full_name as party_a_name,
        pb.id as party_b_id,
        pb.full_name as party_b_name
      FROM voucher v
      JOIN staff s ON v.staff_id = s.id
      JOIN contract c ON v.contract_id = c.id
      JOIN client pa ON c.party_a = pa.id
      JOIN client pb ON c.party_b = pb.id
      WHERE v.id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Tạo voucher mới
   */
  async create({
    contractId,
    type,
    party,
    paymentTime,
    amount,
    paymentMethod,
    paymentDescription,
    attachments,
    staffId,
  }) {
    const query = `
      INSERT INTO voucher (
        contract_id, type, party, payment_time, amount, 
        payment_method, payment_description, attachments, staff_id, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'created')
      RETURNING *
    `;

    const result = await pool.query(query, [
      contractId,
      type,
      party,
      paymentTime,
      amount,
      paymentMethod,
      paymentDescription || null,
      attachments || null,
      staffId,
    ]);

    return result.rows[0];
  }

  /**
   * Cập nhật voucher
   */
  async update(
    id,
    {
      party,
      paymentTime,
      amount,
      paymentMethod,
      paymentDescription,
      attachments,
    }
  ) {
    const query = `
      UPDATE voucher 
      SET 
        party = COALESCE($2, party),
        payment_time = COALESCE($3, payment_time),
        amount = COALESCE($4, amount),
        payment_method = COALESCE($5, payment_method),
        payment_description = COALESCE($6, payment_description),
        attachments = COALESCE($7, attachments)
      WHERE id = $1 AND status = 'created'
      RETURNING *
    `;

    const result = await pool.query(query, [
      id,
      party || null,
      paymentTime || null,
      amount || null,
      paymentMethod || null,
      paymentDescription,
      attachments || null,
    ]);

    return result.rows[0] || null;
  }

  /**
   * Xóa voucher (chỉ khi status = 'created')
   */
  async delete(id) {
    const query = `
      DELETE FROM voucher 
      WHERE id = $1 AND status = 'created'
      RETURNING id
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Xác nhận voucher
   */
  async confirm(id) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Update voucher status
      const updateVoucherQuery = `
        UPDATE voucher 
        SET status = 'confirmed'
        WHERE id = $1 AND status = 'created'
        RETURNING *
      `;
      const voucherResult = await client.query(updateVoucherQuery, [id]);

      if (voucherResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return null;
      }

      const voucher = voucherResult.rows[0];

      // If receipt, update contract paid_amount
      if (voucher.type === 'receipt') {
        const updateContractQuery = `
          UPDATE contract 
          SET 
            paid_amount = paid_amount + $1,
            remaining_amount = total_value - (paid_amount + $1)
          WHERE id = $2
        `;
        await client.query(updateContractQuery, [
          voucher.amount,
          voucher.contract_id,
        ]);
      }

      await client.query('COMMIT');
      return voucher;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Lấy thống kê vouchers
   */
  async getStats({ fromDate, toDate, contractId }) {
    const summaryQuery = `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'receipt' AND status = 'confirmed' THEN amount ELSE 0 END), 0) as total_receipts,
        COALESCE(SUM(CASE WHEN type = 'payment' AND status = 'confirmed' THEN amount ELSE 0 END), 0) as total_payments,
        COUNT(CASE WHEN type = 'receipt' THEN 1 END) as receipt_count,
        COUNT(CASE WHEN type = 'payment' THEN 1 END) as payment_count,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_count,
        COUNT(CASE WHEN status = 'created' THEN 1 END) as pending_count
      FROM voucher
      WHERE 
        ($1::date IS NULL OR payment_time::date >= $1)
        AND ($2::date IS NULL OR payment_time::date <= $2)
        AND ($3::bigint IS NULL OR contract_id = $3)
    `;

    const byMonthQuery = `
      SELECT 
        TO_CHAR(payment_time, 'YYYY-MM') as month,
        COALESCE(SUM(CASE WHEN type = 'receipt' AND status = 'confirmed' THEN amount ELSE 0 END), 0) as receipts,
        COALESCE(SUM(CASE WHEN type = 'payment' AND status = 'confirmed' THEN amount ELSE 0 END), 0) as payments
      FROM voucher
      WHERE 
        status = 'confirmed'
        AND ($1::date IS NULL OR payment_time::date >= $1)
        AND ($2::date IS NULL OR payment_time::date <= $2)
        AND ($3::bigint IS NULL OR contract_id = $3)
      GROUP BY TO_CHAR(payment_time, 'YYYY-MM')
      ORDER BY month DESC
      LIMIT 12
    `;

    const params = [fromDate || null, toDate || null, contractId || null];

    const [summaryResult, byMonthResult] = await Promise.all([
      pool.query(summaryQuery, params),
      pool.query(byMonthQuery, params),
    ]);

    return {
      summary: summaryResult.rows[0],
      byMonth: byMonthResult.rows,
    };
  }

  /**
   * Lấy vouchers theo contract
   */
  async findByContractId(contractId) {
    const vouchersQuery = `
      SELECT 
        v.id,
        v.type,
        v.party,
        v.payment_time,
        v.amount,
        v.payment_method,
        v.status
      FROM voucher v
      WHERE v.contract_id = $1
      ORDER BY v.payment_time DESC
    `;

    const contractQuery = `
      SELECT 
        c.id,
        c.type,
        c.total_value,
        c.paid_amount,
        c.remaining_amount,
        c.status
      FROM contract c
      WHERE c.id = $1
    `;

    const summaryQuery = `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'receipt' AND status = 'confirmed' THEN amount ELSE 0 END), 0) as total_receipts,
        COALESCE(SUM(CASE WHEN type = 'payment' AND status = 'confirmed' THEN amount ELSE 0 END), 0) as total_payments,
        COUNT(*) as voucher_count
      FROM voucher
      WHERE contract_id = $1
    `;

    const [vouchersResult, contractResult, summaryResult] = await Promise.all([
      pool.query(vouchersQuery, [contractId]),
      pool.query(contractQuery, [contractId]),
      pool.query(summaryQuery, [contractId]),
    ]);

    return {
      contract: contractResult.rows[0] || null,
      vouchers: vouchersResult.rows,
      summary: summaryResult.rows[0],
    };
  }

  /**
   * Kiểm tra contract có tồn tại và hợp lệ
   */
  async checkContractExists(contractId) {
    const query = `
      SELECT id, status 
      FROM contract 
      WHERE id = $1 AND status != 'cancelled'
    `;
    const result = await pool.query(query, [contractId]);
    return result.rows[0] || null;
  }

  /**
   * Cập nhật attachments cho voucher
   */
  async updateAttachments(id, attachments) {
    const query = `
      UPDATE voucher 
      SET attachments = $2
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id, attachments]);
    return result.rows[0] || null;
  }

  /**
   * Lấy attachments files info
   */
  async getAttachmentFiles(fileIds) {
    if (!fileIds || fileIds.length === 0) return [];

    const query = `
      SELECT id, url, name, type
      FROM file
      WHERE id = ANY($1)
    `;
    const result = await pool.query(query, [fileIds]);
    return result.rows;
  }
}

module.exports = new VoucherRepository();
