# 🚀 部署指南

## 分支说明
- `main`: 主开发分支
- `deploy`: 生产部署分支

## 部署环境变量

在部署时需要设置以下环境变量：

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# DeepSeek API Configuration
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_API_URL=https://api.deepseek.com

# Server Configuration
PORT=3000
NODE_ENV=production
```

## 部署平台支持

### Vercel 部署
1. 连接 GitHub 仓库的 `deploy` 分支
2. 设置构建命令：`npm run build`
3. 设置输出目录：`dist`
4. 配置环境变量

### Netlify 部署
1. 连接 GitHub 仓库的 `deploy` 分支
2. 构建命令：`npm run build`
3. 发布目录：`dist`
4. 配置环境变量

### 传统服务器部署
```bash
# 1. 克隆仓库
git clone https://github.com/YOUR_USERNAME/prompt-optimizer.git
cd prompt-optimizer

# 2. 切换到部署分支
git checkout deploy

# 3. 安装依赖
npm install

# 4. 构建项目
npm run build

# 5. 启动服务
npm start
```

## 部署前检查清单

- [ ] 所有环境变量已配置
- [ ] 数据库连接正常
- [ ] API 接口测试通过
- [ ] 构建命令执行成功
- [ ] 静态资源路径正确

## 常见问题

1. **构建失败**: 检查所有依赖是否已正确安装
2. **API 连接失败**: 确认环境变量设置正确
3. **页面空白**: 检查构建输出目录和服务器配置

## 部署后验证

- [ ] 首页加载正常
- [ ] 登录功能正常
- [ ] Pricing 页面显示正确
- [ ] API 优化功能正常
- [ ] 收藏功能正常 