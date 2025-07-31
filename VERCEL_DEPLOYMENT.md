# 🚀 Vercel 部署指南

## 快速部署步骤

### 1. 准备 GitHub 仓库
确保你的代码已经推送到 GitHub 仓库的 `deploy` 分支。

### 2. 连接 Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账户登录
3. 点击 "New Project"
4. 选择你的 `prompt-optimizer` 仓库
5. 选择 `deploy` 分支

### 3. 配置构建设置
Vercel 会自动检测到这是一个 Vite 项目，但请确认以下设置：

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

#### 必需的环境变量：
```bash
# Supabase Configuration (前端需要)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# DeepSeek API Configuration (后端需要)
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_API_URL=https://api.deepseek.com

# Stripe Configuration (如果启用支付)
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Production Environment
NODE_ENV=production
```

#### 如何添加环境变量：
1. 在 Vercel 项目仪表板中，进入 **Settings** 选项卡
2. 点击 **Environment Variables**
3. 添加上述每个环境变量
4. 选择适用环境：**Production**, **Preview**, **Development**

### 5. 自定义域名（可选）
1. 在项目设置中，进入 **Domains** 选项卡
2. 添加你的自定义域名
3. 配置 DNS 记录指向 Vercel

## 自动部署设置

### GitHub 集成
- 每次推送到 `deploy` 分支将自动触发部署
- Pull Request 会创建预览部署
- 可以在 Vercel 仪表板中查看部署状态

### 分支部署策略
- `deploy` 分支 → 生产环境
- `main` 分支 → 预览环境（可选）

## 部署验证清单

部署完成后，请验证以下功能：

- [ ] 网站可以正常访问
- [ ] 首页加载正常，无控制台错误
- [ ] 用户可以注册/登录
- [ ] Pricing 页面显示正确
- [ ] AI 优化功能正常工作
- [ ] 收藏功能正常（如果已配置 Supabase）
- [ ] 支付功能正常（如果已配置 Stripe）

## 常见问题

### 1. 构建失败
**可能原因：**
- 依赖安装失败
- 环境变量未配置
- 代码中有语法错误

**解决方案：**
- 检查 Vercel 部署日志
- 确保 `package.json` 中的依赖版本正确
- 本地运行 `npm run build` 测试构建

### 2. API 请求失败
**可能原因：**
- 环境变量未正确配置
- API 路由配置错误
- 跨域问题

**解决方案：**
- 检查环境变量是否正确设置
- 确认 `vercel.json` 中的路由配置
- 检查 API 端点的跨域设置

### 3. 页面刷新 404
**可能原因：**
- SPA 路由未正确配置

**解决方案：**
- 确保 `vercel.json` 中有正确的路由配置
- 所有路由都重定向到 `index.html`

### 4. 环境变量在客户端未生效
**可能原因：**
- 前端环境变量必须以 `VITE_` 开头

**解决方案：**
- 确保客户端环境变量使用 `VITE_` 前缀
- 重新部署应用

## 性能优化

### 1. 启用 Edge Functions
```json
{
  "functions": {
    "server/index.js": {
      "maxDuration": 30
    }
  }
}
```

### 2. 缓存策略
Vercel 会自动为静态资源设置缓存头，但你可以自定义：

```json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## 监控和分析

### 1. Vercel Analytics
在项目设置中启用 Vercel Analytics 来监控网站性能。

### 2. 错误监控
考虑集成 Sentry 或其他错误监控服务。

## 部署命令参考

```bash
# 本地预览部署构建
npm run build
npm run preview

# 使用 Vercel CLI 部署
npx vercel
npx vercel --prod
```

## 支持

如果遇到问题：
1. 查看 Vercel 部署日志
2. 检查 [Vercel 文档](https://vercel.com/docs)
3. 查看项目的 GitHub Issues 