const { dashboardServices } = require("../services");

const getAnalytics = async (req, res) => {
  try {
    const queryMonth = parseInt(req.query.month, 10);
    const queryYear = parseInt(req.query.year, 10);
    const filterDate = new Date(); //new UTC date here would be better

    if (!isNaN(queryMonth) && queryMonth >= 1 && queryMonth <= 12) {
      filterDate.setMonth(queryMonth - 1);
    }

    if (!isNaN(queryYear) && queryYear > 0) {
      filterDate.setFullYear(queryYear);
    }

    const analytics = await dashboardServices.getAnalytics(
      req.userId,
      filterDate
    );

    const monthlyStatus = await dashboardServices.getCurrentMonthStatus(
      req.userId,
      filterDate
    );

    const expenseAnalytics = await dashboardServices.getCurrentMonthExpenses(
      req.userId,
      filterDate
    );

    return res.status(200).json({
      data: {
        message: "Analytics data sent",
        analytics: analytics,
        expenseAnalytics: expenseAnalytics,
        remainingAmount: monthlyStatus.remainingAmount,
        monthlyBudgetAmount: monthlyStatus.budgetAmount,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: "Unable to retrive Analytics." });
  }
};

module.exports = {
  getAnalytics,
};
