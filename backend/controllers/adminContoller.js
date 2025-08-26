import db from "../config/db.js";
import bcrypt from "bcrypt";

import { generateToken } from "../utils/token.util.js";

const saltRounds = 10;

export const adminRegister = async (req, res) => {
  const { email, password, userName, secret } = req.body;

  if (!email || !password || !userName || !secret) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!(secret === "1")) {
    return res.status(409).json({ error: "Somthing Wrong." });
  }

  try {
    const userExists = await db.query(
      "SELECT * FROM admin_user WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hash = await bcrypt.hash(password, saltRounds);
    const user = await db.query(
      "INSERT INTO admin_user (email, hash_password, userName) VALUES ($1, $2, $3) RETURNING id, userName",
      [email, hash, userName]
    );

    const token = generateToken({
      userId: user.rows[0].id,
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        uName: user.rows[0].username,
      });
    //------------------- Cookie -----------------------
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const user = await db.query("SELECT * FROM admin_user WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].hash_password
    );

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken({
      userId: user.rows[0].id,
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        uName: user.rows[0].username,
      });

    //------------------- Cookie -----------------------
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const adminLogOut = (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
};

export const adminQrData = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    let baseQuery = `
      SELECT q.id, q.scan_count, q.package_type, u.email, q.redirect_url, q.created_date 
      FROM users u 
      JOIN qr_data q ON u.id = q.user_id
    `;

    let countQuery = `
      SELECT COUNT(*) 
      FROM users u 
      JOIN qr_data q ON u.id = q.user_id
    `;

    let queryParams = [];
    let whereConditions = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      whereConditions.push(
        `(u.email ILIKE $${paramCount} OR q.package_type ILIKE $${paramCount} OR q.redirect_url ILIKE $${paramCount})`
      );
      queryParams.push(`%${search}%`);
    }

    if (whereConditions.length > 0) {
      const whereClause = " WHERE " + whereConditions.join(" AND ");
      baseQuery += whereClause;
      countQuery += whereClause;
    }

    // Add pagination
    baseQuery += ` ORDER BY q.created_date DESC LIMIT $${
      paramCount + 1
    } OFFSET $${paramCount + 2}`;

    // Get total count
    const countResult = await db.query(countQuery, queryParams);
    const totalCount = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / limit);

    // Get paginated data
    const dataParams = [...queryParams, limit, offset];
    const qrData = await db.query(baseQuery, dataParams);

    res.status(200).json({
      data: qrData.rows,
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    });
  } catch (err) {
    console.error("Admin QR Data Error:", err);
    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

export const updateQrdata = async (req, res) => {
  try {
    const id = req.query.id;
    const { scan_count, package_type } = req.body;

    console.log("Update request received:", { id, scan_count, package_type });

    if (!id) {
      return res.status(400).json({ message: "QR ID is required" });
    }

    if (scan_count === undefined || !package_type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (scan_count < 0) {
      return res.status(400).json({ message: "Scan count cannot be negative" });
    }

    // Start transaction
    await db.query('BEGIN');

    // Verify the QR exists first and get current values
    const verifyResult = await db.query(
      'SELECT scan_count, package_type FROM qr_data WHERE id = $1',
      [id]
    );

    if (verifyResult.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ message: "QR data not found" });
    }

    const currentData = verifyResult.rows[0];
    const oldScanCount = currentData.scan_count;
    const oldPackageType = currentData.package_type;

    // Check if there are actual changes
    const hasChanges = oldScanCount !== parseInt(scan_count) || oldPackageType !== package_type;

    if (!hasChanges) {
      await db.query('ROLLBACK');
      return res.status(200).json({
        message: "No changes detected",
        data: currentData
      });
    }

    // Log the change to audit table
    await db.query(
      `INSERT INTO qr_data_audit 
       (qr_id, old_scan_count, new_scan_count, old_package_type, new_package_type, changed_by, change_date, change_type)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), 'UPDATE')`,
      [id, oldScanCount, scan_count, oldPackageType, package_type, req.user?.id || 'admin']
    );

    // Perform the update
    const updateResult = await db.query(
      "UPDATE qr_data SET scan_count = $1, package_type = $2 WHERE id = $3 RETURNING *",
      [scan_count, package_type, id]
    );

    await db.query('COMMIT');
    
    const updatedData = updateResult.rows[0];
    
    res.status(200).json({
      message: "QR data updated successfully",
      data: updatedData,
      audit: {
        old_scan_count: oldScanCount,
        new_scan_count: scan_count,
        old_package_type: oldPackageType,
        new_package_type: package_type
      }
    });
  } catch (err) {
    // Always attempt to rollback on error
    try {
      await db.query('ROLLBACK');
    } catch (rollbackError) {
      console.error("Rollback error:", rollbackError);
    }
    
    console.error("Update QR Data Error:", err);
    
    res.status(500).json({
      message: "Failed to update QR data",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
export const adminUserData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    let query = `
      SELECT id, email, username, created_at 
      FROM users 
    `;
    let countQuery = `SELECT COUNT(*) FROM users `;
    let queryParams = [];
    let whereConditions = [];

    if (search) {
      whereConditions.push(`(email ILIKE $1 OR username ILIKE $1)`);
      queryParams.push(`%${search}%`);
    }

    if (whereConditions.length > 0) {
      query += " WHERE " + whereConditions.join(" AND ");
      countQuery += " WHERE " + whereConditions.join(" AND ");
    }

    query += ` ORDER BY created_at DESC LIMIT $${
      queryParams.length + 1
    } OFFSET $${queryParams.length + 2}`;

    // Get total count
    const countResult = await db.query(countQuery, queryParams);
    const totalCount = parseInt(countResult.rows[0].count);

    // Get paginated data
    const userData = await db.query(query, [...queryParams, limit, offset]);

    res.status(200).json({
      users: userData.rows,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const adminPayLog = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";
    const timeframe = req.query.timeframe || "all";
    const packageFilter = req.query.package || "all";
    const offset = (page - 1) * limit;

    let paymentQuery = `
      SELECT p.id, p.sub_package, p.price, p.date, u.email 
      FROM pay_log p
      JOIN users u ON p.user_id = u.id
    `;

    let countQuery = `SELECT COUNT(*) FROM pay_log p JOIN users u ON p.user_id = u.id `;
    let revenueQuery = `SELECT sub_package, SUM(price) as total FROM pay_log `;

    let queryParams = [];
    let whereConditions = [];
    let revenueWhereConditions = [];

    // Search filter
    if (search) {
      whereConditions.push(`u.email ILIKE $${queryParams.length + 1}`);
      queryParams.push(`%${search}%`);
    }

    // Package filter
    if (packageFilter !== "all") {
      whereConditions.push(`p.sub_package = $${queryParams.length + 1}`);
      revenueWhereConditions.push(`sub_package = $${queryParams.length + 1}`);
      queryParams.push(packageFilter);
    }

    // Timeframe filter
    let timeframeCondition = "";
    switch (timeframe) {
      case "week":
        timeframeCondition = `date >= NOW() - INTERVAL '7 days'`;
        break;
      case "month":
        timeframeCondition = `date >= NOW() - INTERVAL '30 days'`;
        break;
      case "year":
        timeframeCondition = `date >= NOW() - INTERVAL '365 days'`;
        break;
      default:
        timeframeCondition = "";
    }

    if (timeframeCondition) {
      whereConditions.push(timeframeCondition);
      revenueWhereConditions.push(timeframeCondition);
    }

    // Build WHERE clauses
    if (whereConditions.length > 0) {
      const whereClause = " WHERE " + whereConditions.join(" AND ");
      paymentQuery += whereClause;
      countQuery += whereClause;
    }

    if (revenueWhereConditions.length > 0) {
      revenueQuery += " WHERE " + revenueWhereConditions.join(" AND ");
    }

    // Add ordering and pagination
    paymentQuery += ` ORDER BY p.date DESC LIMIT $${
      queryParams.length + 1
    } OFFSET $${queryParams.length + 2}`;

    // Get total count
    const countResult = await db.query(countQuery, queryParams);
    const totalCount = parseInt(countResult.rows[0].count);

    // Get paginated payments
    const paymentData = await db.query(paymentQuery, [
      ...queryParams,
      limit,
      offset,
    ]);

    // Get revenue statistics
    const totalRevenueResult = await db.query(
      "SELECT SUM(price) as total FROM pay_log"
    );
    const weeklyRevenueResult = await db.query(
      `SELECT SUM(price) as total FROM pay_log WHERE date >= NOW() - INTERVAL '7 days'`
    );
    const monthlyRevenueResult = await db.query(
      `SELECT SUM(price) as total FROM pay_log WHERE date >= NOW() - INTERVAL '30 days'`
    );
    const yearlyRevenueResult = await db.query(
      `SELECT SUM(price) as total FROM pay_log WHERE date >= NOW() - INTERVAL '365 days'`
    );
    const packageRevenueResult = await db.query(
      "SELECT sub_package, SUM(price) as total FROM pay_log GROUP BY sub_package"
    );

    const revenueStats = {
      total: parseFloat(totalRevenueResult.rows[0].total) || 0,
      weekly: parseFloat(weeklyRevenueResult.rows[0].total) || 0,
      monthly: parseFloat(monthlyRevenueResult.rows[0].total) || 0,
      yearly: parseFloat(yearlyRevenueResult.rows[0].total) || 0,
      byPackage: {},
    };

    packageRevenueResult.rows.forEach((row) => {
      revenueStats.byPackage[row.sub_package] = parseFloat(row.total) || 0;
    });

    res.status(200).json({
      payments: paymentData.rows,
      revenueStats,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error("Error fetching payment data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, qr_id, change_type, start_date, end_date } = req.query;
    const offset = (page - 1) * limit;

    let baseQuery = `
      SELECT 
        a.id as audit_id,
        a.qr_id,
        a.old_scan_count,
        a.new_scan_count,
        a.old_package_type,
        a.new_package_type,
        a.changed_by,
        a.change_date,
        a.change_type,
        q.redirect_url,
        q.created_date as qr_created_date
      FROM qr_data_audit a
      LEFT JOIN qr_data q ON a.qr_id = q.id
    `;

    let countQuery = `SELECT COUNT(*) FROM qr_data_audit a`;
    let whereConditions = [];
    let queryParams = [];
    let paramCount = 0;

    // Build WHERE conditions
    if (qr_id) {
      paramCount++;
      whereConditions.push(`a.qr_id = $${paramCount}`);
      queryParams.push(qr_id);
    }

    if (change_type) {
      paramCount++;
      whereConditions.push(`a.change_type = $${paramCount}`);
      queryParams.push(change_type);
    }

    if (start_date) {
      paramCount++;
      whereConditions.push(`a.change_date >= $${paramCount}`);
      queryParams.push(start_date);
    }

    if (end_date) {
      paramCount++;
      whereConditions.push(`a.change_date <= $${paramCount}`);
      queryParams.push(end_date);
    }

    if (whereConditions.length > 0) {
      const whereClause = ' WHERE ' + whereConditions.join(' AND ');
      baseQuery += whereClause;
      countQuery += whereClause;
    }

    // Add sorting and pagination
    baseQuery += ` ORDER BY a.change_date DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;

    // Get total count
    const countResult = await db.query(countQuery, queryParams);
    const totalCount = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / limit);

    // Get paginated data
    const dataParams = [...queryParams, limit, offset];
    const auditData = await db.query(baseQuery, dataParams);

    res.status(200).json({
      data: auditData.rows,
      currentPage: parseInt(page),
      totalPages,
      totalCount,
      hasNext: page < totalPages,
      hasPrev: page > 1
    });

  } catch (err) {
    console.error("Get Audit Logs Error:", err);
    res.status(500).json({
      message: "Failed to fetch audit logs",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};