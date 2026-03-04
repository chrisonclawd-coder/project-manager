module.exports = {
  apps: [{
    name: 'project-manager-dev',
    script: 'npm',
    args: 'run dev',
    cwd: '/home/clawdonaws/.openclaw/workspace/project-manager',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    error_file: '/home/clawdonaws/.pm2/logs/manager-error.log',
    out_file: '/home/clawdonaws/.pm2/logs/manager-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '500M',
    restart_delay: 4000
  }]
}
