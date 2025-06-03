# 🚀 Stripe 生产环境配置指南

## 📋 概述

本指南将帮助您将 AI 提示词优化器从 Stripe 测试环境切换到生产环境，让用户可以进行真实付款。

## ⚠️ 重要提醒

**在切换到生产环境之前，请确保：**
- 您的 Stripe 账户已完成业务验证
- 您了解 Stripe 的费用结构
- 您已经测试了所有支付流程

## 🔧 步骤 1: Stripe Dashboard 配置

### 1.1 切换到生产模式

1. 登录 [Stripe Dashboard](https://dashboard.stripe.com/)
2. 点击左上角的 "测试数据" 开关，切换到 "实时数据"
3. 如果提示需要激活账户，请完成必要的验证步骤

### 1.2 创建生产环境产品和价格

在生产模式下，重新创建您的产品：

**个人版产品**
```
产品名称: AI 提示词优化器 - 个人版
描述: 每月10次AI提示词优化，适合个人和偶尔使用的场景
```

创建价格：
- 月付：$1.99/月
- 年付：$19.99/年

**专业版产品**
```
产品名称: AI 提示词优化器 - 专业版  
描述: 每月100次AI提示词优化，适合专业用户和频繁使用的场景
```

创建价格：
- 月付：$9.99/月
- 年付：$99.99/年

### 1.3 获取生产环境 API 密钥

1. 在 Stripe Dashboard 中，确保处于 "实时数据" 模式
2. 转到 `开发者` → `API 密钥`
3. 复制以下密钥：
   - **可发布密钥** (以 `pk_live_` 开头)
   - **密钥** (以 `sk_live_` 开头)

## 🌐 步骤 2: Vercel 环境变量配置

### 2.1 更新 Vercel 环境变量

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择您的项目：`prompt-optimizer-tau-sand`
3. 转到 `Settings` → `Environment Variables`
4. 更新以下变量：

```bash
# Stripe 生产环境配置
STRIPE_SECRET_KEY=sk_live_你的生产环境密钥
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_你的生产环境可发布密钥
```

**注意：** 保持其他环境变量不变：
- `DEEPSEEK_API_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 2.2 重新部署项目

更新环境变量后，触发新的部署：
1. 在 Vercel Dashboard 中点击 `Deployments`
2. 点击 `Redeploy` 按钮
3. 等待部署完成

## 🔗 步骤 3: 配置生产环境 Webhook

### 3.1 创建 Webhook 端点

1. 在 Stripe Dashboard（生产模式）中，转到 `开发者` → `Webhooks`
2. 点击 `+ 添加端点`
3. 配置端点：

```
端点 URL: https://prompt-optimizer-tau-sand.vercel.app/api/webhook
描述: AI 提示词优化器生产环境 Webhook

选择事件:
✅ checkout.session.completed
✅ customer.subscription.created
✅ customer.subscription.updated
✅ customer.subscription.deleted
✅ invoice.payment_succeeded
✅ invoice.payment_failed
```

### 3.2 配置 Webhook 密钥

1. 创建 webhook 后，点击进入详情页面
2. 在 "签名密钥" 部分，点击 "显示"
3. 复制以 `whsec_` 开头的密钥
4. 在 Vercel 环境变量中添加：

```bash
STRIPE_WEBHOOK_SECRET=whsec_你的webhook密钥
```

5. 再次重新部署项目

## 🛠️ 步骤 4: 更新价格 ID

### 4.1 获取生产环境价格 ID

在 Stripe Dashboard 中：
1. 转到 `产品目录`
2. 点击每个产品，复制对应的价格 ID（以 `price_` 开头）

### 4.2 更新代码中的价格 ID

**重要：** 您需要将代码中的价格 ID 更新为生产环境的实际 ID。

在 `src/components/PricingPage.jsx` 中：

```javascript
const PRICE_IDS = {
  personal: {
    monthly: 'price_您的个人版月付价格ID', // 替换为实际的生产环境价格ID
    yearly: 'price_您的个人版年付价格ID'   // 替换为实际的生产环境价格ID
  },
  professional: {
    monthly: 'price_您的专业版月付价格ID', // 替换为实际的生产环境价格ID
    yearly: 'price_您的专业版年付价格ID'   // 替换为实际的生产环境价格ID
  }
}
```

## 🧪 步骤 5: 测试生产环境

### 5.1 启用测试支付

在正式发布前，可以使用以下测试卡号进行测试：

**注意：** 在生产模式下，只有您的 Stripe 账户关联的邮箱可以使用测试卡号。

```
测试卡号: 4242 4242 4242 4242
过期日期: 任何未来日期
CVC: 任何3位数字
```

### 5.2 验证支付流程

1. 访问 https://prompt-optimizer-tau-sand.vercel.app/pricing
2. 选择一个订阅计划
3. 使用测试卡号完成支付
4. 验证支付成功页面
5. 检查 Stripe Dashboard 中的支付记录
6. 确认 Webhook 事件被正确处理

## 💳 步骤 6: 配置客户门户

### 6.1 启用客户门户

1. 在 Stripe Dashboard 中，转到 `设置` → `客户门户`
2. 点击 "激活客户门户"
3. 配置以下设置：

**品牌设置：**
- 上传您的 Logo
- 设置品牌颜色
- 自定义欢迎信息

**功能设置：**
- ✅ 查看发票
- ✅ 更新付款方式
- ✅ 取消订阅
- ✅ 暂停订阅（可选）

**产品设置：**
- 选择您创建的产品
- 允许客户升级/降级

## 🔍 步骤 7: 监控和维护

### 7.1 设置监控

1. **Stripe Dashboard 监控：**
   - 定期检查支付状态
   - 监控失败支付
   - 查看订阅变化

2. **Vercel 函数监控：**
   - 检查 API 函数日志
   - 监控错误率
   - 确保 Webhook 正常工作

### 7.2 设置通知

1. **Stripe 通知：**
   - 转到 `设置` → `通知`
   - 启用重要事件的邮件通知

2. **Webhook 监控：**
   - 定期检查 Webhook 日志
   - 确保事件正确处理

## ✅ 检查清单

部署前请确认：

- [ ] Stripe 账户已切换到生产模式
- [ ] 生产环境产品和价格已创建
- [ ] Vercel 环境变量已更新（所有 `sk_live_` 和 `pk_live_` 密钥）
- [ ] Webhook 端点已配置并测试
- [ ] 代码中的价格 ID 已更新为生产环境 ID
- [ ] 客户门户已激活和配置
- [ ] 测试支付流程正常工作
- [ ] 监控和通知已设置

## 🚨 安全提醒

1. **永远不要在前端代码中暴露 `sk_live_` 密钥**
2. **定期轮换 API 密钥**
3. **启用 Stripe 的 2FA 认证**
4. **监控异常支付活动**
5. **备份重要的 Stripe 配置**

## 📞 故障排除

### 常见问题：

**Q: 支付按钮点击后没有反应？**
A: 检查浏览器控制台错误，确认 API 调用是否指向正确的域名。

**Q: Webhook 事件未被处理？**
A: 检查 Vercel 函数日志，确认 Webhook 签名验证正确。

**Q: 价格显示不正确？**
A: 确认代码中的价格 ID 与 Stripe Dashboard 中的一致。

---

完成以上步骤后，您的 AI 提示词优化器就可以接受真实付款了！ 🎉 