# 🚀 生产环境部署指南

## 1. 域名配置

### 步骤 1：在 Vercel 中添加域名
1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择项目 → Settings → Domains
3. 添加您的自定义域名

### 步骤 2：DNS 配置
在您的域名提供商处配置 DNS：

```
# 使用 A 记录 (推荐)
Type: A
Name: @  
Value: 76.76.19.61

Type: A
Name: www
Value: 76.76.19.61

# 或使用 CNAME 记录
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## 2. 环境变量配置

在 Vercel Dashboard → Settings → Environment Variables 中配置：

### 必需的环境变量：
```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Deepseek API
DEEPSEEK_API_KEY=your_deepseek_api_key

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# 生产环境 URL
VITE_APP_URL=https://your-domain.com
```

### 可选的环境变量：
```bash
# Google Analytics
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Vercel Analytics
VITE_VERCEL_ANALYTICS_ID=your_analytics_id
```

## 3. Supabase 生产配置

### 更新 Site URL：
```
Authentication → Settings → Site URL
设置为：https://your-domain.com
```

### 更新 Redirect URLs：
```
Authentication → Settings → Redirect URLs
添加：https://your-domain.com/**
```

### 配置 Email Templates：
```
Authentication → Email Templates
更新所有邮件模板中的链接为生产域名
```

## 4. Stripe 生产配置

### 启用 Live Mode：
1. 切换到 Live Mode
2. 获取生产环境的 API Keys
3. 更新 Webhook 端点：`https://your-domain.com/api/webhook`

### 配置 Webhook：
```
Events to send:
- customer.subscription.created
- customer.subscription.updated  
- customer.subscription.deleted
- invoice.payment_succeeded
- invoice.payment_failed
```

## 5. 性能优化

### 图片优化：
- 使用 WebP 格式
- 添加适当的 lazy loading
- 压缩图片文件

### 代码优化：
```bash
# 构建分析
npm run build -- --analyze

# 检查包大小
npx vite-bundle-analyzer dist
```

## 6. 监控和分析

### 添加 Google Analytics：
```javascript
// 在 index.html 中添加
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

### 启用 Vercel Analytics：
```bash
npm install @vercel/analytics
```

## 7. SEO 优化

### Meta 标签：
- 确保所有页面有适当的 title 和 description
- 添加 Open Graph 标签
- 配置 robots.txt

### 站点地图：
```xml
<!-- public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.com</loc>
    <lastmod>2024-12-24</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

## 8. 安全检查清单

- ✅ HTTPS 强制重定向
- ✅ 安全响应头配置
- ✅ 环境变量安全存储
- ✅ API 速率限制
- ✅ 输入验证和清理
- ✅ CORS 配置

## 9. 备份和监控

### 数据库备份：
- 配置 Supabase 自动备份
- 定期导出重要数据

### 监控设置：
- 配置 Vercel 的错误监控
- 设置 uptime 监控
- 配置性能警报

## 10. 上线检查清单

- [ ] 域名配置完成
- [ ] SSL 证书激活
- [ ] 环境变量配置
- [ ] 数据库配置更新
- [ ] 支付系统测试
- [ ] 邮件功能测试
- [ ] 性能测试
- [ ] 安全扫描
- [ ] SEO 检查
- [ ] 监控配置

## 常见问题

### Q: 域名解析需要多长时间？
A: 通常 24-48 小时内生效，但可能最多需要 72 小时。

### Q: 如何测试生产环境？
A: 可以使用临时域名先测试，确认无误后再切换正式域名。

### Q: 遇到 SSL 证书问题怎么办？
A: 确保域名 DNS 解析正确，Vercel 会自动申请证书。如有问题可联系 Vercel 支持。 