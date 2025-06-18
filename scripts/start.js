const { spawn } = require('child_process');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const isDev = env === 'development' || env === 'local';

// Use the local nodemon if in dev/local
const runner = isDev
  ? `"${path.join(__dirname, '..', 'node_modules', '.bin', process.platform === 'win32' ? 'nodemon.cmd' : 'nodemon')}"`
  : 'node';
const args = ['server.js'];

const child = spawn(runner, args, { stdio: 'inherit' , shell: true});

child.on('exit', code => process.exit(code));