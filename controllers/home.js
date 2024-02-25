exports.home = async (req, res) => {
    res.json({
        success: true,
        message: "Welcome to LangoHM API",
    });
};