# إصلاح مشكلة Node.js Version

## المشكلة:

Next.js 16.0.3 يتطلب Node.js >= 20.9.0، لكن السيرفر يستخدم Node.js 18.20.8

## الحل على SSH:

```bash
# 1. تثبيت Node.js 20 باستخدام NVM
source ~/.nvm/nvm.sh
nvm install 20
nvm use 20
nvm alias default 20

# 2. التحقق من الإصدار
node --version  # يجب أن يظهر v20.x.x

# 3. تحديث restart_nextjs.sh لاستخدام Node.js 20
cat > ~/domains/damahomerealty.com/public_html/restart_nextjs.sh << 'EOF'
#!/bin/bash
source ~/.nvm/nvm.sh
nvm use 20
export PATH="$HOME/.nvm/versions/node/v20.$(nvm version 20 | cut -d. -f2)/bin:$PATH"

FRONTEND_DIR="$HOME/domains/damahomerealty.com/public_html/frontend"
NODE_BIN=$(which node)
NEXT_BIN="$FRONTEND_DIR/node_modules/.bin/next"

cd "$FRONTEND_DIR"

if [ ! -d "node_modules" ] || [ ! -f "$NEXT_BIN" ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S'): Installing dependencies..."
    npm install --omit=dev --legacy-peer-deps 2>&1
fi

if ! pm2 list | grep -q "nextjs.*online"; then
    echo "$(date '+%Y-%m-%d %H:%M:%S'): Starting Next.js..."
    pm2 delete nextjs 2>/dev/null
    pm2 start "$NEXT_BIN" --name nextjs -- start --interpreter "$NODE_BIN" 2>&1
    pm2 save 2>/dev/null
else
    if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "$(date '+%Y-%m-%d %H:%M:%S'): Restarting Next.js..."
        pm2 restart nextjs 2>/dev/null
        pm2 save 2>/dev/null
    fi
fi
EOF

chmod +x ~/domains/damahomerealty.com/public_html/restart_nextjs.sh

# 4. حذف PM2 process القديم وإعادة تشغيله
pm2 delete nextjs 2>/dev/null
cd ~/domains/damahomerealty.com/public_html/frontend
NODE_BIN=$(which node)
NEXT_BIN="$HOME/domains/damahomerealty.com/public_html/frontend/node_modules/.bin/next"
pm2 start "$NEXT_BIN" --name nextjs -- start --interpreter "$NODE_BIN"
pm2 save

# 5. إضافة cron job
echo "*/5 * * * * $HOME/domains/damahomerealty.com/public_html/restart_nextjs.sh >> $HOME/nextjs_restart.log 2>&1" | crontab -

# 6. التحقق
pm2 status nextjs
pm2 logs nextjs --lines 10
```
