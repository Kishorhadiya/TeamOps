import pool from "../config/pg.config.js";

export const createEvent = async (req, res) => {
  try {
    const { title, description, date, file } = req.body;

    const Events = await pool.query(
      "insert into events (title,description,date,file) values($1,$2,$3,$4) RETURNING *",
      [title, description, date, file],
    );

    return res.status(201).json({
      message: "Event Created",
      Event: Events.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const GetAllEvents = async (req, res) => {
  try {
    const AllEvents = await pool.query("select * from events order by id desc limit 20");
    return res.status(200).json({
      message: "Events Fetched",
      Events: AllEvents.rows,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const DeleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const EventDelete = await pool.query(
      "DELETE FROM events WHERE id = $1 RETURNING *",
      [id]
    );

    if (EventDelete.rows.length === 0) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    return res.status(200).json({
      message: "Event Deleted",
      Event: EventDelete.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};