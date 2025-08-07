# AI 提示词优化器

使用 Deepseek-V3 模型帮助改进和完善 AI 提示词，提升对话效果。

## ✨ 特性

- 🧠 **Deepseek-V3 驱动** - 使用先进的 AI 模型分析和改进提示词
- 🔐 **用户认证** - 基于 Supabase 的登录注册功能（可选）
- ❤️ **收藏管理** - 保存优化结果，随时查看
- 🎯 **多种优化策略** - 综合优化、清晰度优化、具体性增强、创意激发

## 🚀 快速开始

### 环境要求

- Node.js 16.x+
- Deepseek API Key

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd prompt-optimizer

# 安装依赖
npm install

# 配置环境变量
cp env.example .env
# 编辑 .env 文件，添加 DEEPSEEK_API_KEY

# 启动服务
npm run server  # 后端服务
npm run dev     # 前端开发
```

访问 `http://localhost:3000`

## 🎯 使用方法

1. 输入要优化的提示词
2. 选择优化策略
3. 点击"开始优化"或按 Ctrl/Cmd + Enter
4. 查看优化结果和分析报告

## 🛠️ 技术栈

- **前端**: React 18 + Vite + Tailwind CSS
- **后端**: Node.js + Express
- **AI**: Deepseek-V3 API
- **认证**: Supabase（可选）

## 🔧 API 接口

```http
POST /api/optimize
{
  "prompt": "要优化的提示词",
  "strategy": "comprehensive"
}
```

## 📄 许可证

MIT License

## 🙋‍♂️ 支持

- 创建 [Issue](https://github.com/your-repo/prompt-optimizer/issues)
- 发送邮件至 contact@promptoptimizer.com

---

**让 AI 更好地理解您的意图！** 🚀 