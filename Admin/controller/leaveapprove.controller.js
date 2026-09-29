import "dotenv/config";
import pool from "../config/pg.config.js";

const isUUID = (str) =>
  typeof str === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim());

export const leaveApproveController = async (req, res) => {
  try {
    const { id, leaveid, adminid, userid, status } = req.body;

    const targetLeaveId = id || leaveid;
    const validAdminId = isUUID(adminid) ? adminid : null;
    const leaveStatus = status || "Approved";

    let result;
    if (isUUID(targetLeaveId)) {
      result = await pool.query(
        "UPDATE leave SET status = $1, approveid = $2 WHERE id = $3 RETURNING *",
        [leaveStatus, validAdminId, targetLeaveId]
      );
    } else if (isUUID(userid)) {
      result = await pool.query(
        "UPDATE leave SET status = $1, approveid = $2 WHERE userid = $3 RETURNING *",
        [leaveStatus, validAdminId, userid]
      );
    } else if (targetLeaveId) {
      result = await pool.query(
        "UPDATE leave SET status = $1, approveid = $2 WHERE id::text = $3 RETURNING *",
        [leaveStatus, validAdminId, String(targetLeaveId)]
      );
    } else {
      result = await pool.query(
        "UPDATE leave SET status = $1, approveid = $2 WHERE userid::text = $3 RETURNING *",
        [leaveStatus, validAdminId, String(userid || "")]
      );
    }

    if (!result || result.rowCount === 0) {
      return res.status(404).json({ message: "Leave record not found or not updated" });
    }

    return res.status(200).json({
      message: `Leave status updated to ${leaveStatus} successfully`,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("leaveApproveController error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const AllLeave = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        l.id          AS leaveid,
        l.id          AS id,
        l.startdate   AS fromdate,
        l.enddate     AS todate,
        l.status,
        l.reason,
        l.userid,
        l.approveid,
        COALESCE(u.username, 'Employee') AS username,
        COALESCE(u.email, 'employee@company.com') AS email
       FROM leave l
       LEFT JOIN users u ON l.userid = u.id
       ORDER BY l.startdate DESC NULLS LAST, l.id DESC`
    );

    return res.status(200).json({
      message: "Leaves fetched successfully",
      AllLeave: result.rows,
    });
  } catch (error) {
    console.error("AllLeave query error:", error.message);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const leaveApproveHistory = async (req, res) => {
  try {
    const { adminid, userid, status, leaveid, id } = req.body;

    const targetLeaveId = leaveid || id;
    const validAdminId = isUUID(adminid) ? adminid : null;
    const leaveStatus = status || "Approved";

    let Approve;
    if (isUUID(targetLeaveId)) {
      Approve = await pool.query(
        "UPDATE leave SET status = $1, approveid = $2 WHERE id = $3 RETURNING *",
        [leaveStatus, validAdminId, targetLeaveId]
      );
    } else if (isUUID(userid) && isUUID(targetLeaveId)) {
      Approve = await pool.query(
        "UPDATE leave SET status = $1, approveid = $2 WHERE userid = $3 AND id = $4 RETURNING *",
        [leaveStatus, validAdminId, userid, targetLeaveId]
      );
    } else if (isUUID(userid)) {
      Approve = await pool.query(
        "UPDATE leave SET status = $1, approveid = $2 WHERE userid = $3 RETURNING *",
        [leaveStatus, validAdminId, userid]
      );
    } else {
      Approve = await pool.query(
        "UPDATE leave SET status = $1, approveid = $2 WHERE id::text = $3 OR userid::text = $4 RETURNING *",
        [leaveStatus, validAdminId, String(targetLeaveId || ""), String(userid || "")]
      );
    }

    if (!Approve || Approve.rowCount === 0) {
      return res.status(404).json({ message: "Leave record not found" });
    }

    return res.status(200).json({
      message: "Leave updated successfully",
      data: Approve.rows[0],
    });
  } catch (error) {
    console.error("leaveApproveHistory error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    let activeEmployees = 0;
    let pendingLeave = 0;

    try {
      const userRes = await pool.query("SELECT COUNT(*) FROM users");
      activeEmployees = parseInt(userRes.rows[0]?.count || 0, 10);
    } catch (err) {
      console.warn("User count error:", err.message);
      activeEmployees = 1;
    }

    try {
      const leaveRes = await pool.query(
        "SELECT COUNT(*) FROM leave WHERE LOWER(COALESCE(status, 'pending')) = 'pending'"
      );
      pendingLeave = parseInt(leaveRes.rows[0]?.count || 0, 10);
    } catch (err) {
      console.warn("Leave count error:", err.message);
      pendingLeave = 0;
    }

    return res.status(200).json({
      success: true,
      activeEmployees,
      pendingLeave,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
