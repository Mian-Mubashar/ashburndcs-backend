const asyncHandler = (fn) => async (req, res) => {
  try {
    const result = await fn(req, res);
    res.status(result.status).json(result.body);
  } catch (error) {
    console.error("[Auth]", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

module.exports = asyncHandler;
