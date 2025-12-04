module.exports = {
  apps: [
    {
      name: "nextjs",
      script: "/home/u646739138/domains/damahomerealty.com/public_html/frontend/.next/standalone/server.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1"
      }
    }
  ]
}
