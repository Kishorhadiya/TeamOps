import pool from "../config/pg.config.js";

export const createLeave = async (req, res) => {
  try {
    const { userid, reason, startdate, enddate } = req.body;

    const leaves = await pool.query(
      `INSERT INTO leave (userid,reason, startdate, enddate)
       VALUES ($1, $2,$3,$4)
       RETURNING *`,
      [userid, reason, startdate, enddate],
    );

    return res.status(201).json({
      message: "Leave created",
      Leave: leaves.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const LeaveGetAll = async (req, res) => {
  try {
    const { userid } = req.body;
    const leaveType = await pool.query("select * from leave where userid=$1", [
      userid,
    ]);

    return res.status(201).json({
      message: "All leave Show",
      AllLeave: leaveType.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
