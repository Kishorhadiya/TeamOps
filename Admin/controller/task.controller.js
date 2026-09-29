import pool from "../config/pg.config.js";

export const createTask = async (req, res) => {
  try {
    const { task, userid, adminid, status, startdate, enddate } = req.body;

    const isUUID = (str) =>
      typeof str === "string" &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

    const validUserId = isUUID(userid) ? userid : null;
    const validAdminId = isUUID(adminid) ? adminid : null;
    
    // Postgres column `task` is text[] (array)
    const taskArray = Array.isArray(task) ? task : [String(task || "Task")];
    // Postgres column `status` is boolean (true = Completed, false = In Progress/To Do)
    const boolStatus = status === true || status === "Completed" || status === "completed";

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
      ],
    );

    return res.status(201).json({
      message: "Task Created",
      task: Task.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.id, t.userid, t.adminid, t.task, t.status, t.startdate, t.enddate,
              u.username as assignee_name, u.email as assignee_email
       FROM task t
       LEFT JOIN users u ON t.userid = u.id
       ORDER BY t.startdate DESC, t.id DESC`
    );

    const mappedTasks = result.rows.map((row) => ({
      ...row,
      task: Array.isArray(row.task) ? row.task.join(", ") : row.task,
      status: row.status === true ? "Completed" : "In Progress",
    }));

    return res.status(200).json({
      message: "Tasks fetched",
      tasks: mappedTasks,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const boolStatus = status === true || status === "Completed" || status === "completed";

    const result = await pool.query(
      "UPDATE task SET status = $1 WHERE id = $2 RETURNING *",
      [boolStatus, id]
    );

    return res.status(200).json({
      message: "Task updated",
      task: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
