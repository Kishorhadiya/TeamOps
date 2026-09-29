import "dotenv/config";
import pool from "../config/pg.config.js";

const isUUID = (str) =>
  typeof str === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim());

export const createTask = async (req, res) => {
  try {
    const { task, userid, adminid, status, startdate, enddate } = req.body;

    const validUserId = isUUID(userid) ? userid.trim() : null;
    const validAdminId = isUUID(adminid) ? adminid.trim() : null;

    // Postgres column `task` is text[] (array)
    const taskArray = Array.isArray(task)
      ? task.map(String)
      : [String(task || "Task Assignment")];

    // Postgres column `status` is boolean (true = Completed, false = In Progress/To Do)
    const boolStatus =
      status === true ||
      status === "Completed" ||
      status === "completed" ||
      status === "Done";

    const Task = await pool.query(
      `INSERT INTO task
       (task, userid, adminid, status, startdate, enddate)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        taskArray,
        validUserId,
        validAdminId,
        boolStatus,
        startdate || new Date().toISOString().slice(0, 10),
        enddate || new Date().toISOString().slice(0, 10),
      ]
    );

    return res.status(201).json({
      message: "Task created successfully",
      task: Task.rows[0],
    });
  } catch (error) {
    console.error("createTask error:", error);
    return res.status(500).json({
      message: error.message || "Failed to create task",
    });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.id, t.userid, t.adminid, t.task, t.status, t.startdate, t.enddate,
              COALESCE(u.username, 'Assigned Employee') as assignee_name,
              COALESCE(u.email, 'employee@company.com') as assignee_email
       FROM task t
       LEFT JOIN users u ON t.userid = u.id
       ORDER BY t.startdate DESC NULLS LAST, t.id DESC`
    );

    const mappedTasks = result.rows.map((row) => ({
      ...row,
      task: Array.isArray(row.task) ? row.task.join(", ") : String(row.task || ""),
      status: row.status === true ? "Completed" : "In Progress",
    }));

    return res.status(200).json({
      message: "Tasks fetched successfully",
      tasks: mappedTasks,
    });
  } catch (error) {
    console.error("getAllTasks error:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch tasks",
    });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const boolStatus =
      status === true ||
      status === "Completed" ||
      status === "completed" ||
      status === "Done";

    if (!id) {
      return res.status(400).json({ message: "Task id is required" });
    }

    let result;
    if (isUUID(id)) {
      result = await pool.query(
        "UPDATE task SET status = $1 WHERE id = $2 RETURNING *",
        [boolStatus, id.trim()]
      );
    } else {
      result = await pool.query(
        "UPDATE task SET status = $1 WHERE id::text = $2 RETURNING *",
        [boolStatus, String(id)]
      );
    }

    if (!result || result.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({
      message: "Task status updated successfully",
      task: result.rows[0],
    });
  } catch (error) {
    console.error("updateTaskStatus error:", error);
    return res.status(500).json({
      message: error.message || "Failed to update task status",
    });
  }
};
