## ✨ 特性

- 🧠 **Deepseek-V3驱动** - 使用先进的Deepseek-V3模型分析和改进提示词
- 🔐 **用户认证系统** - 支持邮箱密码登录和Google OAuth登录
- ❤️ **收藏管理** - 收藏您满意的优化结果，随时查看和管理
- 🎯 **多种优化策略** - 提供综合优化、清晰度优化、具体性增强、创意激发等多种策略
- 🧮 **强化推理能力** - 利用Deepseek-V3的强大推理能力进行深度优化
- ⚡ **实时优化** - 快速响应，即时获得优化结果
- 📝 **多样化建议** - 提供多种替代优化方案
- 📱 **响应式设计** - 支持桌面端和移动端
- 🔗 **OAuth集成** - 便捷的Google账号一键登录

## 🚀 快速开始

   
   编辑 `.env` 文件，添加必要的配置：
   ```
   # 服务器配置
   PORT=3001
   
   # Deepseek配置 (必需)
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   
   # Supabase配置 (可选，用于邮箱登录)
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Google OAuth配置 (可选，用于Google登录)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   VITE_API_URL=http://localhost:3001
   VITE_APP_URL=http://localhost:5173
   
   # 安全配置
   JWT_SECRET=your_jwt_secret_here
   ```
   
   **注意**：
   - 如果不配置Supabase，应用仍可运行，但邮箱登录功能将被禁用
   - Google OAuth配置详见 [Google OAuth设置指南](GOOGLE_OAUTH_SETUP.md)

4. **配置用户认证（可选）**
   
   本项目支持两种认证方式：
   - **邮箱密码登录**：参考 [Supabase配置指南](./SUPABASE_SETUP.md)
   - **Google OAuth登录**：参考 [Google OAuth设置指南](GOOGLE_OAUTH_SETUP.md)
   
   您可以选择配置其中一种或两种都配置。

5. **启动后端服务**
   ```bash