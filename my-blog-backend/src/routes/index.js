const articleController = require('../controllers/articleController');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middlewares/auth');
 
// 管理员接口
router.get('/api/admin/visitor-logs', verifyToken, isAdmin, adminController.getVisitorLogs);
router.get('/api/admin/visitor-stats', verifyToken, isAdmin, adminController.getVisitorStats);
router.get('/api/admin/ip-geolocation', verifyToken, isAdmin, adminController.getIpGeolocation); 