const mongoose = require('mongoose');

// Route-level middleware: validates that req.params.id is a valid MongoDB ObjectId
const validateId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: `Invalid ID format: '${id}'` });
  }

  next(); // Valid ID, proceed to the route handler
};

module.exports = validateId;
