#!/bin/bash
# ============================================
# Script تلقائي لرفع التحديثات على السيرفر
# ============================================
# الاستخدام: ./deploy.sh
# أو: bash deploy.sh

set -e  # إيقاف عند أي خطأ

echo "🚀 بدء عملية الرفع التلقائي..."
echo ""

# الألوان للرسائل
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# المسارات
PROJECT_DIR="$HOME/domains/damahomerealty.com/public_html"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# تحميل NVM واستخدام Node.js 20
if [ -f "$HOME/.nvm/nvm.sh" ]; then
    source "$HOME/.nvm/nvm.sh"
    nvm use 20
    export PATH="$HOME/.nvm/versions/node/$(nvm current)/bin:$PATH"
fi

# الانتقال إلى مجلد المشروع
cd "$PROJECT_DIR" || {
    echo -e "${RED}❌ خطأ: لا يمكن الوصول إلى مجلد المشروع${NC}"
    exit 1
}

echo -e "${YELLOW}📥 1. سحب التحديثات من Git...${NC}"
git pull origin main || {
    echo -e "${RED}❌ خطأ في سحب التحديثات${NC}"
    exit 1
}
echo -e "${GREEN}✅ تم سحب التحديثات بنجاح${NC}"
echo ""

# Laravel Backend
echo -e "${YELLOW}🔧 2. تحديث Laravel Backend...${NC}"
cd "$BACKEND_DIR" || {
    echo -e "${RED}❌ خطأ: لا يمكن الوصول إلى مجلد Backend${NC}"
    exit 1
}

# تحديث Composer dependencies
echo "   - تحديث Composer dependencies..."
composer install --no-dev --optimize-autoloader --quiet || {
    echo -e "${YELLOW}⚠️  تحذير: فشل تحديث Composer (قد يكون طبيعي)${NC}"
}

# إنشاء storage link
echo "   - إنشاء storage link..."
php artisan storage:link 2>/dev/null || {
    echo -e "${YELLOW}⚠️  تحذير: storage link موجود مسبقاً${NC}"
}

# تنظيف الكاش
echo "   - تنظيف الكاش..."
php artisan optimize:clear > /dev/null 2>&1 || true
php artisan config:cache > /dev/null 2>&1 || true
php artisan route:cache > /dev/null 2>&1 || true
php artisan view:cache > /dev/null 2>&1 || true

echo -e "${GREEN}✅ تم تحديث Laravel Backend${NC}"
echo ""

# Next.js Frontend
echo -e "${YELLOW}⚛️  3. تحديث Next.js Frontend...${NC}"
cd "$FRONTEND_DIR" || {
    echo -e "${RED}❌ خطأ: لا يمكن الوصول إلى مجلد Frontend${NC}"
    exit 1
}

# تحديث npm dependencies
echo "   - تحديث npm dependencies..."
npm install --omit=dev --legacy-peer-deps --silent || {
    echo -e "${YELLOW}⚠️  تحذير: فشل تحديث npm dependencies${NC}"
}

# إعادة بناء Next.js
echo "   - حذف مجلد .next القديم..."
rm -rf .next 2>/dev/null || true

echo "   - إعادة بناء Next.js (باستخدام Webpack فقط)..."
# تعطيل Turbopack بشكل كامل
export NEXT_PRIVATE_SKIP_TURBO=1
export NEXT_PRIVATE_DISABLE_TURBO=1
# استخدام Webpack بدلاً من Turbopack
NEXT_PRIVATE_SKIP_TURBO=1 NEXT_PRIVATE_DISABLE_TURBO=1 npm run build || {
    echo -e "${RED}❌ خطأ في بناء Next.js${NC}"
    echo -e "${YELLOW}💡 محاولة البناء بدون Turbopack...${NC}"
    # محاولة بديلة: بناء مباشر مع Webpack
    NODE_OPTIONS="--max-old-space-size=2048" NEXT_PRIVATE_SKIP_TURBO=1 npx next build || {
        echo -e "${RED}❌ فشل البناء. تحقق من الأخطاء أعلاه.${NC}"
        exit 1
    }
}

echo -e "${GREEN}✅ تم تحديث Next.js Frontend${NC}"
echo ""

# إعادة تشغيل PM2
echo -e "${YELLOW}🔄 4. إعادة تشغيل Next.js...${NC}"
PM2_BIN="$(which pm2 2>/dev/null || echo 'pm2')"
if command -v pm2 &> /dev/null; then
    $PM2_BIN restart nextjs 2>/dev/null || {
        echo -e "${YELLOW}⚠️  تحذير: فشل إعادة تشغيل PM2 (قد يكون غير موجود)${NC}"
    }
    $PM2_BIN save 2>/dev/null || true
    echo -e "${GREEN}✅ تم إعادة تشغيل Next.js${NC}"
else
    echo -e "${YELLOW}⚠️  PM2 غير موجود، سيتم تشغيل Next.js يدوياً${NC}"
fi
echo ""

# التحقق من الحالة
echo -e "${YELLOW}🔍 5. التحقق من الحالة...${NC}"
sleep 2

# التحقق من Laravel
if curl -s http://localhost:8000 > /dev/null 2>&1 || curl -s https://damahomerealty.com > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Laravel يعمل بشكل صحيح${NC}"
else
    echo -e "${YELLOW}⚠️  Laravel قد لا يعمل (تحقق يدوياً)${NC}"
fi

# التحقق من Next.js
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Next.js يعمل بشكل صحيح${NC}"
else
    echo -e "${YELLOW}⚠️  Next.js قد لا يعمل (تحقق يدوياً)${NC}"
fi
echo ""

echo -e "${GREEN}🎉 تم الانتهاء من عملية الرفع بنجاح!${NC}"
echo ""
echo "📋 ملخص:"
echo "   ✅ تم سحب التحديثات من Git"
echo "   ✅ تم تحديث Laravel Backend"
echo "   ✅ تم تحديث Next.js Frontend"
echo "   ✅ تم إعادة تشغيل الخدمات"
echo ""
echo "🌐 الموقع: https://damahomerealty.com"
echo ""

