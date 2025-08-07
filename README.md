   
   编辑 `.env` 文件，添加必要的配置：
   ```
   # 服务器配置
   PORT=3001
   
   # AI服务配置（必需）
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   
   # 用户认证配置（可选）
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # 支付功能配置（可选）
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```
   
   **注意**：
   - 如果不配置Supabase，应用仍可运行，但用户认证功能将被禁用
   - 如果不配置Stripe，应用仍可运行，但支付功能将被禁用

4. **配置Supabase（可选）**
   
   如需启用用户认证功能，请参考 [Supabase配置指南](./SUPABASE_SETUP.md) 进行详细配置。

5. **启动应用**
   
   **方式一：同时启动前端和后端（推荐）**
   ```bash
   npm start
   ```
   
   **方式二：分别启动**
   ```bash
   # 启动后端服务
   npm run server
   
   # 在另一个终端启动前端
   npm run dev
   ```

6. **访问应用**
   
   打开浏览器访问 `http://localhost:3000`

- 支持用户级别的数据隔离和安全访问
- 自动备份，数据永不丢失

### 💳 支付功能（可选）

本项目集成了 Stripe 支付系统，提供订阅制付费模式。

#### 订阅计划
- **个人版** - $1.99/月（年付享8折优惠）
  - 无限制优化次数
  - 基础功能访问
  - 标准响应速度
  
- **专业版** - $9.99/月（年付享8折优惠）
  - 无限制优化次数
  - 高级优化策略
  - 优先响应速度
  - 批量优化功能
  - API访问权限

#### 配置 Stripe
1. 在 [Stripe Dashboard](https://dashboard.stripe.com) 创建账户
2. 获取 API 密钥
3. 在 `.env` 文件中配置相应的密钥
4. 创建产品和价格计划

**注意**：如果不需要付费功能，可以跳过 Stripe 配置，应用将以免费模式运行。

### 优化策略详解

#### 🔮 综合优化
└── ...
```

## 📜 可用脚本

本项目提供以下 npm 脚本命令：

### 开发相关
- `npm start` - 同时启动前端和后端服务（推荐）
- `npm run dev` - 启动前端开发服务器
- `npm run server` - 启动后端 API 服务器
- `npm run server:dev` - 开发模式下启动后端服务器

### 构建相关
- `npm run build` - 构建前端应用
- `npm run build:prod` - 生产环境构建（包含优化）
- `npm run deploy:build` - 部署构建（安装依赖并构建）
- `npm run preview` - 预览构建结果

### 生产运行
- `npm run serve` - 以生产模式运行服务器
- `npm run health-check` - 执行健康检查

### 代码质量
- `npm run lint` - 运行 ESLint 检查
- `npm run typecheck` - 运行 TypeScript 类型检查

## 🔧 API 接口

### 优化提示词
- 桌面端和移动端适配
- 流畅的动画效果

## 🤖 Claude Code 集成

本项目集成了 Claude Code GitHub Action，提供智能化的开发协助。

### 功能特性
- **PR 自动协助**：在 Pull Request 中使用 `@claude` 获取代码审查和建议
- **Issue 解决方案**：在 Issue 中使用 `@claude` 获取问题解决建议
- **代码优化建议**：自动分析代码并提供改进建议
- **智能化文档生成**：协助生成和更新文档

### 使用方法
1. 在 PR 或 Issue 中评论 `@claude` 并描述需要的帮助
2. Claude 将自动分析上下文并提供相应的建议
3. 支持多轮对话，可以继续与 Claude 交互

详见 `.github/workflows/claude.yml` 配置文件。

## 🚀 部署

### 开发环境

### 生产环境
```bash
# 构建生产版本
npm run build:prod

# 本地预览生产构建
npm run preview

# 运行生产服务器
npm run serve
```

### Vercel 部署（推荐）

本项目已针对 Vercel 平台进行优化，提供一键部署功能。

#### 快速部署
1. Fork 本仓库
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量
4. 点击部署

详细部署指南请参考 [Vercel 部署文档](./VERCEL_DEPLOYMENT.md)。

### Docker 部署
```dockerfile
# Dockerfile 示例
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:prod
EXPOSE 3000 3001
CMD ["npm", "run", "serve"]
```

### 其他部署选项
- **传统服务器部署**：参考 [部署指南](./deploy.md)
- **云服务部署**：支持 AWS、Google Cloud、Azure 等主流云平台
- **容器化部署**：支持 Docker、Kubernetes 等容器平台

## 🤝 贡献指南

我们欢迎所有形式的贡献！请阅读以下指南：

## 📋 开发计划

### 已完成功能 ✅
- [x] 用户认证系统（基于 Supabase）
- [x] 收藏管理功能
- [x] 支付系统集成（Stripe）
- [x] Vercel 一键部署
- [x] Claude Code GitHub 集成
- [x] 生产环境优化配置
- [x] 统一启动脚本

### 计划中功能 🚧
- [ ] 实现优化历史记录
- [ ] 支持批量优化
- [ ] 添加更多优化策略
- [ ] 集成更多AI服务提供商（GPT-4、Claude等）
- [ ] 支持多语言界面
- [ ] 添加提示词模板库
- [ ] 实现团队协作功能
- [ ] API 速率限制和配额管理
- [ ] 数据导出功能
- [ ] 高级分析仪表板

## 📄 许可证
