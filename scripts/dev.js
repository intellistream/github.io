#!/usr/bin/env node
// scripts/dev.js

const fs = require('fs');
const cp = require('child_process');
const open = require('open');

async function main() {
  // 1. 安装依赖（如未安装）
  if (!fs.existsSync('node_modules')) {
    console.log('🔧 安装依赖...');
    cp.execSync('npm install', { stdio: 'inherit' });
  }

  // 2. 启动 dev 服务
  console.log('🚀 启动开发服务器...');
  const dev = cp.spawn('npm run dev', { shell: true, stdio: 'inherit' });

  // 3. 启动后自动打开浏览器
  setTimeout(() => {
    open('http://localhost:3000');
  }, 2000);

  // 保持进程存活
  dev.on('close', (code) => process.exit(code));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
