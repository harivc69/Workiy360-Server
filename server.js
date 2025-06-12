const app = require('./app');
const config = require('./config/config');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${config.environment} mode on port ${PORT}`);
});
