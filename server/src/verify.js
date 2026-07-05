try {
  console.log('Verifying server requires...');
  require('./config/db');
  require('./models/User');
  require('./models/Task');
  require('./middleware/auth');
  require('./services/groqService');
  require('./controllers/authController');
  require('./controllers/taskController');
  require('./controllers/statsController');
  require('./routes/auth');
  require('./routes/tasks');
  require('./routes/stats');
  console.log('✅ All imports verified successfully!');
} catch (error) {
  console.error('❌ Require verification failed:', error.stack);
  process.exit(1);
}
