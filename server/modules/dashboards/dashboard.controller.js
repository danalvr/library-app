const { dashboardService } = require("./dashboard.service");

exports.dashboardController = {
  async overview(req, res, next) {
    try {
      const data = await dashboardService.getOverview();
      res.json({
        status: "success",
        data,
      });
    } catch (err) {
      next(err);
    }
  },
};
