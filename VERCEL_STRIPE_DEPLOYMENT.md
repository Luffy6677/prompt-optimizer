# Vercel Stripe 部署指南

## 🎯 概述

本指南将帮助您在 Vercel 上部署集成了 Stripe 支付功能的 AI 提示词优化工具。

## 📋 部署前准备

### 1. Stripe 配置

确保您在 Stripe Dashboard 中已经：

1. **创建产品和价格**：
   - 登录 [Stripe Dashboard](https://dashboard.stripe.com/)
   - 转到 "产品目录" → "添加产品"
   - 为每个套餐创建对应的价格（月付/年付）

2. **获取 API 密钥**：
   - 转到 "开发者" → "API 密钥"
   - 复制 "可发布密钥" 和 "密钥"

3. **创建 Webhook 端点**（部署后配置）

### 2. 环境变量配置

在 Vercel Dashboard 中配置以下环境变量：

```bash
# Stripe 配置
STRIPE_SECRET_KEY=sk_test_... # 或 sk_live_... 用于生产环境
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... # 或 pk_live_... 用于生产环境
STRIPE_WEBHOOK_SECRET=whsec_... # Webhook 密钥（部署后获取）

# Deepseek API 配置
DEEPSEEK_API_KEY=your_deepseek_api_key

# Supabase 配置（如果使用）
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚀 部署步骤

### 1. 推送代码到 Git 仓库

```bash
git add .
git commit -m "Add Stripe payment integration for Vercel"
git push origin main
```

### 2. 在 Vercel 中导入项目

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Import Project"
3. 选择您的 Git 仓库
4. 配置构建设置：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3. 配置环境变量

在 Vercel 项目设置中：
1. 转到 "Settings" → "Environment Variables"
2. 添加上述所有环境变量
3. 确保为不同环境（Development, Preview, Production）设置正确的值

### 4. 部署项目

点击 "Deploy" 按钮，Vercel 将自动部署您的项目。

## 🔗 配置 Stripe Webhook

部署完成后，您需要配置 Stripe Webhook：

### 1. 获取 Webhook URL

您的 webhook URL 格式为：
```
https://your-vercel-domain.vercel.app/api/webhook
```

### 2. 在 Stripe Dashboard 中创建 Webhook

1. 转到 "开发者" → "Webhooks"
2. 点击 "添加端点"
3. 输入您的 webhook URL
4. 选择以下事件：
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### 3. 获取 Webhook 密钥

1. 创建 webhook 后，点击进入详情页面
2. 在 "签名密钥" 部分，点击 "显示"
3. 复制 `whsec_...` 密钥
4. 在 Vercel 环境变量中添加 `STRIPE_WEBHOOK_SECRET`

## 🧪 测试支付集成

### 1. 本地测试

使用 Vercel CLI 进行本地测试：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 本地运行
vercel dev

# 项目将在 http://localhost:3000 运行
```

### 2. 测试支付流程

1. 访问定价页面：`/pricing`
2. 点击 "立即订阅"
3. 使用 Stripe 测试卡号：
   - 成功支付：`4242 4242 4242 4242`
   - 失败支付：`4000 0000 0000 0002`

### 3. 验证 Webhook

1. 完成测试支付
2. 检查 Vercel 函数日志
3. 确认 webhook 事件被正确处理

## 📁 API 端点说明

项目包含以下 Vercel Serverless 函数：

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/optimize` | POST | 提示词优化 |
| `/api/create-checkout-session` | POST | 创建 Stripe 结账会话 |
| `/api/checkout-session` | GET | 获取结账会话详情 |
| `/api/subscription` | GET | 获取用户订阅信息 |
| `/api/create-portal-session` | POST | 创建客户门户会话 |
| `/api/webhook` | POST | 处理 Stripe Webhook |

## 🔧 价格ID 配置

更新 `src/components/PricingPage.jsx` 中的价格ID：

```javascript
const PRICE_IDS = {
  personal: {
    monthly: 'price_1RTGzFP1MsuVjL1H9FCVdz3C', // 您的个人版月付价格ID
    yearly: 'price_1RTGzqP1MsuVjL1HXuMWpJsP'   // 您的个人版年付价格ID
  },
  professional: {
    monthly: 'price_1RTH0vP1MsuVjL1HfoJp8ueE', // 您的专业版月付价格ID
    yearly: 'price_1RTH1MP1MsuVjL1HdMK2LLqm'   // 您的专业版年付价格ID
  }
}
```

同时更新 `api/subscription.js` 中的价格限制映射。

## ⚠️ 注意事项

### 安全性

1. **永远不要在前端代码中暴露 secret key**
2. **使用 HTTPS** - Vercel 自动提供 SSL
3. **验证 webhook 签名** - 已在代码中实现

### 环境管理

1. **测试环境**：使用 `sk_test_` 和 `pk_test_` 密钥
2. **生产环境**：使用 `sk_live_` 和 `pk_live_` 密钥
3. **分别配置** webhook 端点

### 监控

1. 查看 Vercel 函数日志监控错误
2. 使用 Stripe Dashboard 监控支付状态
3. 设置 Stripe 邮件通知

## 🐛 常见问题

### 1. Webhook 签名验证失败

**原因**: 原始请求体解析问题  
**解决**: 确保 `api/webhook.js` 中的 `bodyParser: false` 配置正确

### 2. CORS 错误

**原因**: 跨域请求被阻止  
**解决**: 检查 API 函数中的 CORS 头设置

### 3. 环境变量未生效

**原因**: Vercel 环境变量配置问题  
**解决**: 重新部署项目，确保环境变量正确设置

### 4. 价格ID 无效

**原因**: 使用了产品ID而非价格ID  
**解决**: 在 Stripe Dashboard 中复制正确的 `price_` 开头的ID

## 📞 支持

如果您遇到问题：

1. 检查 Vercel 函数日志
2. 查看 Stripe Dashboard 中的事件日志
3. 参考 Stripe 和 Vercel 官方文档

---

## 🎉 部署成功！

完成以上步骤后，您的 AI 提示词优化工具就成功集成了 Stripe 支付功能，并可以在 Vercel 上正常运行了！ 