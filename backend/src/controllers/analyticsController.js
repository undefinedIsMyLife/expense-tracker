import { AnalyticsService } from '../services/AnalyticsService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const analyticsController = {
  getAnalytics: asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    const analytics = await AnalyticsService.getAnalytics(req.user.userId, {
      startDate,
      endDate
    });

    res.status(200).json({
      message: 'Analytics fetched successfully',
      data: analytics
    });
  })
};
