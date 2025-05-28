# AI 提示词优化器

📖 **NEW: English Documentation Available!** Click the "Documentation" button in the navigation bar to access comprehensive English user guides, tutorials, and feature explanations.

一款基于Deepseek-V3的提示词优化工具，支持付费订阅模式，帮助用户改进和完善他们的AI提示词，提升AI对话的效果和质量。

## ✨ 特性

- 🧠 **Deepseek-V3驱动** - 使用先进的Deepseek-V3模型分析和改进提示词
- 🔐 **用户认证系统** - 基于Supabase的安全登录注册功能
- 💳 **付费订阅模式** - 集成Stripe支付，支持个人版和专业版订阅
- 📊 **使用次数管理** - 根据订阅计划管理用户的优化次数
- ❤️ **收藏管理** - 收藏您满意的优化结果，随时查看和管理
- 🎯 **多种优化策略** - 提供综合优化、清晰度优化、具体性增强、创意激发等多种策略
- 🧮 **强化推理能力** - 利用Deepseek-V3的强大推理能力进行深度优化
- 📊 **详细分析报告** - 提供清晰度、具体性、有效性等维度的评分和分析
- 💰 **客户门户** - 集成Stripe客户门户，用户可自助管理订阅和发票
- 🎨 **现代化界面** - 美观易用的React前端界面
- ⚡ **实时优化** - 快速响应，即时获得优化结果
- 📝 **多样化建议** - 提供多种替代优化方案
- 📱 **响应式设计** - 支持桌面端和移动端
- 🔒 **安全支付** - 使用Stripe确保支付安全，支持多种支付方式

## 🚀 快速开始

### 环境要求

- Node.js 16.x 或更高版本
- npm 或 yarn
- Deepseek API Key (用于AI功能)
- Supabase项目 (用于用户认证)
- Stripe账户 (用于支付功能)

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd prompt-optimizer
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **环境配置**
   ```bash
   cp env.example .env
   ```
   
   编辑 `.env` 文件，添加必要的配置：
   ```
   PORT=3001
   
   # AI功能配置
   DEEPSEEK_API_KEY=your_deepseek_api_key_here          # 必需，用于AI功能
   
   # 用户认证配置
   VITE_SUPABASE_URL=your_supabase_project_url          # 必需，用于用户认证
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key        # 必需，用于用户认证
   
   # 支付功能配置
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key         # 必需，Stripe可发布密钥
   STRIPE_SECRET_KEY=sk_test_your_key                   # 必需，Stripe密钥
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret      # 必需，Webhook验证
   ```

4. **配置外部服务**
   
   - **Deepseek API**: 参考 [Deepseek配置指南](./DEEPSEEK_SETUP.md)
   - **Supabase**: 参考 [Supabase配置指南](./SUPABASE_SETUP.md)
   - **Stripe支付**: 参考 [Stripe配置指南](./STRIPE_SETUP.md)

5. **启动后端服务**
   ```bash
   npm run server
   ```

6. **启动前端开发服务器**
   ```bash
   npm run dev
   ```

7. **访问应用**
   
   打开浏览器访问 `http://localhost:3000`

## 💳 订阅计划

### 个人版 - $1.99/月 或 $19.99/年
- 每月 10 次 prompt 优化
- 4 种优化策略选择
- 基础结果分析
- 结果收藏功能
- 标准客服支持
- 优化历史记录

### 专业版 - $9.99/月 或 $99.99/年 ⭐ 推荐
- 每月 100 次 prompt 优化
- 全部优化策略
- 高级结果分析
- 无限收藏和分类
- 优先客服支持
- 详细使用统计
- 批量优化功能
- 自定义优化模板
- API 访问权限

## 🎯 使用指南

### 用户注册和订阅

1. **注册账户** - 点击"Login"按钮，选择"立即注册"
2. **邮箱验证** - 验证邮箱地址（如需要）
3. **选择订阅计划** - 在定价页面选择适合的订阅计划
4. **完成支付** - 通过Stripe安全支付，支持信用卡和PayPal
5. **开始使用** - 支付成功后即可开始使用优化服务

### 订阅管理

- **查看订阅状态** - 在定价页面查看当前订阅信息
- **管理订阅** - 点击"管理订阅"进入Stripe客户门户
- **更改计划** - 在客户门户中升级或降级订阅计划
- **取消订阅** - 可随时取消，订阅期结束前仍可使用服务
- **下载发票** - 在客户门户中下载支付发票

### 基本使用流程

1. **登录账户** - 使用注册的邮箱和密码登录
2. **检查订阅状态** - 确保有活跃的订阅计划
3. **输入原始提示词** - 在左侧文本框输入您要优化的提示词
4. **选择优化策略** - 根据需求选择合适的优化策略：
   - **综合优化**：全面改进提示词的各个方面，利用Deepseek-V3的推理能力
   - **清晰度优化**：提高提示词的清晰度和可理解性
   - **具体性增强**：增加提示词的具体性和精确性
   - **创意激发**：优化提示词以激发更有创意的回答
5. **开始优化** - 点击"开始优化"按钮或使用快捷键 Ctrl/Cmd + Enter
6. **查看结果** - 在右侧查看优化后的提示词和详细分析报告
7. **收藏优化结果** - 点击收藏按钮将满意的优化结果保存到个人收藏
8. **复制使用** - 点击复制按钮将优化后的提示词复制到剪贴板

### 使用次数管理

- **查看剩余次数** - 在界面中实时显示本月剩余优化次数
- **次数用完处理** - 当月次数用完时，可升级订阅计划或等待下月重置
- **升级提醒** - 系统会在接近使用限制时提醒用户考虑升级

### 收藏管理功能

#### 收藏优化结果
- 在优化结果页面点击"收藏"按钮
- 为收藏添加自定义标题，便于后续查找
- 系统会保存完整的优化信息，包括原始提示词、优化结果、策略和评分

#### 管理个人收藏
- 点击导航栏的"收藏"tab进入收藏管理页面
- **搜索功能**：根据标题或内容搜索收藏
- **筛选功能**：按优化策略筛选收藏列表
- **排序功能**：按时间、标题或策略排序
- **编辑标题**：双击或点击编辑按钮修改收藏标题
- **复制内容**：一键复制收藏的优化后提示词
- **删除收藏**：删除不需要的收藏项目

#### 收藏数据安全
- 所有收藏数据存储在Supabase云端
- 支持用户级别的数据隔离和安全访问
- 自动备份，数据永不丢失

### 优化策略详解

#### 🔮 综合优化
- 全面分析提示词的各个维度
- 利用Deepseek-V3的强大推理能力进行深度分析
- 平衡清晰度、具体性和有效性
- 引导链式思考过程

#### 💡 清晰度优化
- 专注于消除歧义表达
- 简化复杂句式
- 确保指令易于理解
- 建立清晰的逻辑链条

#### 🎯 具体性增强
- 添加具体的要求和约束
- 明确输出格式和结构
- 提供清晰的示例或参考
- 建立明确的成功标准

#### ⚡ 创意激发
- 鼓励多角度思考
- 激发创新思维
- 促进原创性表达
- 建立创意思维框架

## 🛠️ 技术架构

### 前端技术栈
- **React 18** - 用户界面框架
- **Vite** - 快速的前端构建工具
- **Tailwind CSS** - 原子化CSS框架
- **Framer Motion** - 动画库
- **Lucide React** - 图标库
- **Axios** - HTTP客户端
- **Supabase** - 用户认证和数据库服务
- **Stripe** - 支付处理

### 后端技术栈
- **Node.js** - 运行时环境
- **Express** - Web框架
- **Deepseek API** - AI服务 (Deepseek-V3)
- **Stripe** - 支付和订阅管理
- **CORS** - 跨域支持

### AI模型
- **Deepseek-V3** - 强大的推理和语言理解能力
- **deepseek-chat** - 对话优化模型
- **API兼容** - 兼容OpenAI SDK接口

### 支付功能
- **Stripe Checkout** - 安全的支付流程
- **Subscription Management** - 订阅生命周期管理
- **Customer Portal** - 自助服务门户
- **Webhook Integration** - 实时事件处理

### 项目结构
```
prompt-optimizer/
├── src/                    # 前端源码
│   ├── components/         # React组件
│   ├── services/          # API服务
│   ├── contexts/          # React Context
│   └── ...
├── server/                # 后端源码
│   └── index.js          # 服务器入口
├── public/               # 静态资源
├── STRIPE_SETUP.md       # Stripe配置指南
└── ...
```

## 🔧 API 接口

### 优化提示词
```http
POST /api/optimize
Content-Type: application/json

{
  "prompt": "要优化的提示词",
  "strategy": "comprehensive"
}
```

### 支付相关接口

#### 创建支付会话
```http
POST /api/create-checkout-session
Content-Type: application/json

{
  "priceId": "price_xxxxx",
  "userId": "user_id",
  "successUrl": "https://domain.com/payment-success",
  "cancelUrl": "https://domain.com/pricing"
}
```

#### 获取订阅信息
```http
GET /api/subscription/:userId
```

#### 创建客户门户会话
```http
POST /api/create-portal-session
Content-Type: application/json

{
  "customerId": "cus_xxxxx",
  "returnUrl": "https://domain.com/pricing"
}
```

#### Webhook处理
```http
POST /api/webhook
Content-Type: application/json
Stripe-Signature: t=timestamp,v1=signature
```

### 获取优化策略列表
```http
GET /api/strategies
```

### 健康检查
```http
GET /health
```

## 🎨 界面预览

### 主界面
- 简洁美观的双栏布局
- 左侧为输入区域，右侧为结果展示
- 顶部策略选择器

### 优化结果
- 优化后的提示词展示
- 详细的分析报告和评分
- 多种替代优化方案

### 响应式设计
- 桌面端和移动端适配
- 流畅的动画效果

## 🚀 部署

### 开发环境
```bash
# 启动开发服务器
npm run dev

# 启动后端服务
npm run server
```

### 生产环境
```bash
# 构建前端
npm run build

# 启动生产服务器
npm run preview
```

### Docker 部署
```dockerfile
# Dockerfile 示例
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000 3001
CMD ["npm", "run", "server"]
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！请阅读以下指南：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📋 开发计划

- [ ] 添加用户认证系统
- [ ] 实现优化历史记录
- [ ] 支持批量优化
- [ ] 添加更多优化策略
- [ ] 集成更多AI服务提供商
- [ ] 支持多语言界面
- [ ] 添加提示词模板库
- [ ] 实现协作功能

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙋‍♂️ 支持

如果您遇到任何问题或有建议，请：

- 创建 [Issue](https://github.com/your-repo/prompt-optimizer/issues)
- 发送邮件至 contact@promptoptimizer.com
- 加入我们的社区讨论

## 🎉 致谢

感谢所有为这个项目做出贡献的开发者和用户！

---

**让AI更好地理解您的意图，从优化提示词开始！** 🚀 