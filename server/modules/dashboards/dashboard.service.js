const { dashboardRepository } = require("./dashboard.repository");

exports.dashboardService = {
  async getOverview() {
    const [
      totalBooks,
      activeMembers,
      //   borrowedToday,
      totalBorrowings,
      overdueBorrowings,
      recentBorrowings,
    ] = await Promise.all([
      dashboardRepository.countBooks(),
      dashboardRepository.countActiveMembers(),
      dashboardRepository.countBorrowings(),
      dashboardRepository.countOverdueBorrowings(),
      dashboardRepository.recentBorrowings(),
    ]);

    return {
      totalBooks,
      activeMembers,
      totalBorrowings,
      overdueBorrowings,
      recentBorrowings,
    };
  },
};
