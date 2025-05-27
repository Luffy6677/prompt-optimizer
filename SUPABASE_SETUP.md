# Supabase 配置指南

本应用使用 Supabase 作为认证和数据库服务。请按照以下步骤设置 Supabase：

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com/) 并注册账户
2. 点击 "New project" 创建新项目
3. 填写项目信息：
   - 项目名称：`prompt-optimizer`
   - 数据库密码：请设置一个强密码
   - 选择离你最近的区域

## 2. 获取项目配置

创建项目后，在项目 Dashboard 中：

1. 点击左侧菜单的 "Settings" → "API"
2. 复制以下信息：
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: `eyJ...` (公开密钥)

## 3. 配置环境变量

1. 在项目根目录创建 `.env` 文件（如果不存在）
2. 添加以下配置：

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. 认证设置

### 启用邮箱认证

1. 在 Supabase Dashboard 中，点击 "Authentication" → "Settings"
2. 在 "Auth Providers" 部分：
   - 确保 "Email" 提供商已启用
   - 可以选择是否启用邮箱确认

### 配置邮件模板（可选）

1. 在 "Authentication" → "Email Templates" 中
2. 自定义注册确认邮件模板
3. 设置网站 URL 和重定向 URL

## 5. 数据库表（可选扩展）

如果需要存储用户的优化历史，可以创建额外的表：

```sql
-- 创建提示词优化历史表
CREATE TABLE optimization_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_prompt TEXT NOT NULL,
  optimized_prompt TEXT NOT NULL,
  strategy VARCHAR(50) NOT NULL,
  scores JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 启用 RLS (Row Level Security)
ALTER TABLE optimization_history ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能访问自己的记录
CREATE POLICY "Users can only access their own optimization history" 
ON optimization_history FOR ALL USING (auth.uid() = user_id);

-- 创建收藏表
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  original_prompt TEXT NOT NULL,
  optimized_prompt TEXT NOT NULL,
  strategy VARCHAR(50) NOT NULL,
  scores JSONB,
  analysis JSONB,
  alternatives JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 启用 RLS (Row Level Security)
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能访问自己的收藏
CREATE POLICY "Users can only access their own favorites" 
ON favorites FOR ALL USING (auth.uid() = user_id);

-- 创建索引优化查询性能
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_created_at ON favorites(created_at DESC);
```

## 6. 测试配置

1. 启动开发服务器：`npm run dev`
2. 在浏览器中打开应用
3. 尝试注册一个新账户
4. 检查 Supabase Dashboard 中的 "Authentication" → "Users" 是否显示新用户

## 7. 生产环境配置

部署到生产环境时：

1. 在 Supabase Dashboard 中设置正确的网站 URL
2. 更新 JWT 过期时间（在 "Settings" → "Auth" 中）
3. 配置邮件服务商（SMTP）
4. 设置自定义域名（如需要）

## 常见问题

### Q: 注册时显示 "Invalid login credentials"
A: 检查 Supabase 项目的邮箱认证设置，确保启用了邮箱注册。

### Q: 登录后页面不更新
A: 检查环境变量是否正确配置，特别是 VITE_ 前缀。

### Q: 无法接收确认邮件
A: 检查 Supabase 的邮件配置，或在开发阶段禁用邮箱确认。

## 安全注意事项

1. **永远不要**提交 `.env` 文件到版本控制
2. 在生产环境中使用环境变量管理服务
3. 定期轮换 API 密钥
4. 启用 RLS (Row Level Security) 保护数据

## 相关文档

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase 认证指南](https://supabase.com/docs/guides/auth)
- [React 集成指南](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs) 