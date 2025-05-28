# Stripe 支付集成设置指南

本指南将帮助您为AI提示词优化器项目设置Stripe支付功能。

## 前提条件

1. 注册 [Stripe 账户](https://stripe.com)
2. 完成账户验证（生产环境需要）

## 步骤 1: 获取 Stripe API 密钥

### 开发环境
1. 登录 Stripe Dashboard
2. 确保处于 "测试模式" (Test mode)
3. 前往 `开发者` > `API 密钥`
4. 复制以下密钥：
   - **可发布密钥** (Publishable key) - 以 `pk_test_` 开头
   - **密钥** (Secret key) - 以 `sk_test_` 开头

### 生产环境
1. 在 Stripe Dashboard 中切换到 "实时模式" (Live mode)
2. 获取实时环境的 API 密钥：
   - **可发布密钥** (Publishable key) - 以 `pk_live_` 开头
   - **密钥** (Secret key) - 以 `sk_live_` 开头

## 步骤 2: 创建产品和价格

1. 在 Stripe Dashboard 中前往 `产品目录`
2. 点击 `+ 添加产品`

### 个人版产品
```
产品名称: AI 提示词优化器 - 个人版
描述: 适合个人用户和偶尔使用的场景，每月10次优化

定价模式: 重复定价
```

创建两个价格：
- **月付**: $1.99/月，价格ID为 `price_personal_monthly`
- **年付**: $19.99/年，价格ID为 `price_personal_yearly`

### 专业版产品
```
产品名称: AI 提示词优化器 - 专业版
描述: 适合专业用户和频繁使用的场景，每月100次优化

定价模式: 重复定价
```

创建两个价格：
- **月付**: $9.99/月，价格ID为 `price_professional_monthly`
- **年付**: $99.99/年，价格ID为 `price_professional_yearly`

## 步骤 3: 配置环境变量

在项目根目录创建 `.env` 文件（如果不存在），添加以下内容：

```bash
# 服务器配置
PORT=3001

# Deepseek API 配置
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# Supabase 配置
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Stripe 配置
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 步骤 4: 更新价格 ID

在 `src/components/PricingPage.jsx` 文件中，更新 `PRICE_IDS` 对象，使用您在 Stripe 中创建的实际价格 ID：

```javascript
const PRICE_IDS = {
  personal: {
    monthly: 'price_1234567890abcdef', // 替换为实际的价格ID
    yearly: 'price_0987654321fedcba'   // 替换为实际的价格ID
  },
  professional: {
    monthly: 'price_abcdef1234567890', // 替换为实际的价格ID
    yearly: 'price_fedcba0987654321'   // 替换为实际的价格ID
  }
}
```

## 步骤 5: 设置 Webhook

Webhook 用于处理支付成功、订阅更新等事件。

### 开发环境（使用 Stripe CLI）

1. 安装 [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. 登录到您的 Stripe 账户：
   ```bash
   stripe login
   ```
3. 转发 webhook 到本地服务器：
   ```bash
   stripe listen --forward-to localhost:3001/api/webhook
   ```
4. CLI 会显示 webhook 签名密钥，复制并添加到 `.env` 文件中

### 生产环境

1. 在 Stripe Dashboard 中前往 `开发者` > `Webhooks`
2. 点击 `+ 添加端点`
3. 配置 webhook：
   ```
   端点 URL: https://your-domain.com/api/webhook
   描述: AI 提示词优化器 Webhook
   
   选择事件:
   - checkout.session.completed
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_succeeded
   - invoice.payment_failed
   ```
4. 保存后，复制 webhook 签名密钥到环境变量中

## 步骤 6: 配置客户门户

1. 在 Stripe Dashboard 中前往 `设置` > `客户门户`
2. 激活客户门户
3. 配置以下设置：
   - **品牌设置**: 上传您的 logo 和自定义颜色
   - **功能**: 启用 "查看发票"、"更新付款方式"、"取消订阅" 等功能
   - **产品**: 选择您创建的产品，允许客户升级/降级

## 步骤 7: 测试支付流程

### 测试卡号
在测试模式下，使用以下测试卡号：

- **成功支付**: `4242 4242 4242 4242`
- **需要 3D Secure**: `4000 0027 6000 3184`
- **被拒绝**: `4000 0000 0000 0002`

所有测试卡都可以使用：
- **过期日期**: 任何未来日期
- **CVC**: 任何3位数字
- **邮政编码**: 任何有效邮政编码

### 测试流程
1. 启动开发服务器：`npm run dev`
2. 启动后端服务器：`npm run server`
3. 访问定价页面
4. 尝试订阅一个计划
5. 使用测试卡号完成支付
6. 验证支付成功页面和 webhook 事件

## 步骤 8: 部署到生产环境

### 环境变量更新
将生产环境的环境变量更新为实时模式的 API 密钥：

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
```

### Vercel 部署
如果使用 Vercel 部署，在项目设置中添加环境变量，并确保：

1. 所有环境变量都已正确设置
2. Webhook URL 指向您的生产域名
3. 客户门户配置已激活

## 常见问题

### Q: 为什么支付失败？
A: 检查以下项目：
- API 密钥是否正确
- 价格 ID 是否存在且有效
- Webhook 端点是否可访问
- 环境变量是否正确设置

### Q: 如何处理税务？
A: 在 Stripe Dashboard 的 `设置` > `税务` 中配置税务设置，Stripe 可以自动计算和收取税费。

### Q: 如何设置优惠券？
A: 在 Stripe Dashboard 的 `产品目录` > `优惠券` 中创建优惠券，然后在 checkout 会话中应用。

### Q: 如何处理退款？
A: 在 Stripe Dashboard 的 `支付` 页面中手动处理退款，或通过 API 自动处理。

## 安全提示

1. **永远不要在前端代码中暴露密钥** - 只使用可发布密钥
2. **验证 webhook 签名** - 确保 webhook 来自 Stripe
3. **使用 HTTPS** - 生产环境必须使用 HTTPS
4. **定期轮换 API 密钥** - 定期更新您的 API 密钥以提高安全性

## 支持

如果遇到问题，请参考：
- [Stripe 官方文档](https://stripe.com/docs)
- [Stripe 社区论坛](https://support.stripe.com)
- 项目的 GitHub Issues

---

设置完成后，您的 AI 提示词优化器就具备了完整的支付功能！ 