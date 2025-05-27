# Deepseek-V3 配置指南

本项目已配置为使用 Deepseek-V3 模型进行提示词优化。以下是配置和使用指南：

## 🚀 获取 Deepseek API Key

1. 访问 [Deepseek 官网](https://www.deepseek.com/)
2. 注册或登录账户
3. 在控制台中创建 API Key
4. 复制您的 API Key

## ⚙️ 环境配置

1. **复制环境变量文件**
   ```bash
   cp env.example .env
   ```

2. **设置 API Key**
   在 `.env` 文件中设置您的 Deepseek API Key：
   ```
   DEEPSEEK_API_KEY=your_actual_deepseek_api_key_here
   ```

## 🔧 模型配置

项目已配置使用以下 Deepseek 设置：

- **模型**: `deepseek-chat` (Deepseek-V3)
- **API 端点**: `https://api.deepseek.com/v1`
- **超时时间**: 30秒
- **兼容性**: 使用 OpenAI SDK 兼容接口

## 🎯 Deepseek-V3 特性

### 强化推理能力
- 链式思考 (Chain of Thought)
- 深度逻辑分析
- 多步骤推理过程

### 语言理解增强
- 精准的语义理解
- 上下文关联分析
- 细致的语言结构优化

### 创意思维
- 多角度思考
- 创新观点生成
- 发散性思维引导

## 💡 优化策略说明

项目中的四种优化策略都充分利用了 Deepseek-V3 的能力：

### 1. 综合优化
利用 Deepseek-V3 的推理能力进行全方位分析，包括：
- 清晰度提升
- 具体性增强
- 逻辑结构优化
- 链式思考引导

### 2. 清晰度优化
专注于语言清晰度，运用深度语言理解：
- 歧义消除
- 句式简化
- 逻辑链条建立

### 3. 具体性增强
利用强大的分析能力：
- 详细要求制定
- 成功标准建立
- 格式规范设计

### 4. 创意激发
发挥创新思维能力：
- 多角度思考框架
- 创意思维引导
- 原创性表达促进

## 🐛 故障排除

### API Key 问题
- 确保 API Key 正确且有效
- 检查账户余额和使用限制
- 验证网络连接

### 响应超时
- Deepseek-V3 响应时间较长，已设置 30秒超时
- 如需调整，修改 `server/index.js` 中的 `timeout` 配置

### Mock 模式
- 如果未配置 API Key，系统将使用 Mock 响应
- Mock 模式仍可体验完整功能流程

## 📊 性能优化

### 建议配置
- 生产环境建议设置更高的超时时间
- 可根据需要调整请求并发数
- 监控 API 使用量和成本

### 缓存策略
- 考虑实现请求缓存减少重复调用
- 优化相似提示词的处理流程

## 🔗 相关链接

- [Deepseek 官方文档](https://docs.deepseek.com/)
- [API 参考文档](https://docs.deepseek.com/api)
- [定价信息](https://www.deepseek.com/pricing)

## 📞 支持

如遇到配置问题，请：
1. 检查上述配置步骤
2. 查看服务器日志输出
3. 联系技术支持团队 