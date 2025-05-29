# Supabase 邮箱验证链接过期问题解决方案

## 问题描述

用户点击邮箱验证链接后出现错误：
```
#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired
```

## 根本原因分析

1. **JWT 过期时间配置过短** - Supabase 默认的邮箱验证链接有效期可能设置过短
2. **重定向 URL 配置不匹配** - Site URL 和 Redirect URL 配置与实际部署域名不符
3. **应用缺少认证回调处理** - 前端应用没有正确处理 Supabase 认证回调参数

## 解决方案

### 1. 配置 Supabase Dashboard 设置

登录 [Supabase Dashboard](https://app.supabase.com)，进入你的项目：

#### 1.1 配置 Auth Settings
1. 进入 "Authentication" → "Settings"
2. 在 "Auth Settings" 中更新以下配置：

```
Site URL: https://prompt-optimizer-5xslvv5rm-my-team-ef799272.vercel.app
```

#### 1.2 配置 Redirect URLs
添加以下重定向 URL：
```
https://prompt-optimizer-5xslvv5rm-my-team-ef799272.vercel.app
https://prompt-optimizer-5xslvv5rm-my-team-ef799272.vercel.app/
https://prompt-optimizer-5xslvv5rm-my-team-ef799272.vercel.app/**
```

#### 1.3 配置 JWT 过期时间
1. 在 "Authentication" → "Settings" 页面
2. 找到 "JWT Expiry" 设置
3. 建议设置为：
   - **Access Token Expiry**: 1 hour (3600 seconds)
   - **Refresh Token Expiry**: 30 days (2592000 seconds)

#### 1.4 配置邮件模板
1. 进入 "Authentication" → "Email Templates"
2. 编辑 "Confirm signup" 模板
3. 确保重定向 URL 模板正确：
```
{{ .SiteURL }}#access_token={{ .Token }}&type=signup
```

### 2. 验证环境变量配置

确保 Vercel 项目中配置了正确的环境变量：

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. 测试解决方案

#### 3.1 重新部署应用
```bash
# 如果你有修改，重新部署
git add .
git commit -m "Fix: Add auth callback handling for email verification"
git push origin main
```

#### 3.2 测试邮箱验证流程
1. 访问你的网站
2. 尝试注册新账户
3. 检查邮箱中的验证链接
4. 点击验证链接，确认是否正确重定向并显示成功消息

### 4. 应用代码改进

代码已经进行了以下改进：

1. **增强的认证回调处理** (`src/App.jsx`)
   - 处理 URL hash 中的认证参数
   - 显示适当的错误和成功消息
   - 自动清理 URL 参数

2. **改进的 Supabase 配置** (`src/services/supabase.js`)
   - 添加了认证设置配置
   - 启用 PKCE 流程
   - 配置邮箱重定向 URL

3. **增强的认证模态框** (`src/components/AuthModal.jsx`)
   - 添加重新发送验证邮件功能
   - 更好的错误处理
   - 用户友好的提示信息

4. **改进的通知系统** (`src/components/Toast.jsx`)
   - 支持操作按钮
   - 更好的错误消息展示
   - 自动关闭成功消息

### 5. 故障排除

#### 5.1 如果问题仍然存在

1. **检查 Supabase 日志**
   - 在 Supabase Dashboard 中查看 "Authentication" → "Users" 
   - 查看用户的邮箱确认状态

2. **清除浏览器缓存**
   - 清除 localStorage 和 sessionStorage
   - 重新打开浏览器

3. **检查邮件服务**
   - 确认邮件没有被标记为垃圾邮件
   - 检查邮件链接是否完整

#### 5.2 手动确认用户邮箱（临时解决方案）

如果需要立即解决，可以在 Supabase Dashboard 中：
1. 进入 "Authentication" → "Users"
2. 找到用户记录
3. 点击用户邮箱
4. 手动设置 "Email Confirmed" 为 true

### 6. 预防措施

1. **定期检查配置**
   - 确保生产环境的 URL 配置正确
   - 监控认证成功率

2. **用户体验优化**
   - 提供清晰的错误消息
   - 添加重新发送验证邮件的选项
   - 设置合理的过期时间

3. **监控和日志**
   - 在应用中添加认证事件日志
   - 监控认证失败率

## 常见问题

### Q: 为什么邮箱验证链接会过期？
A: Supabase 的邮箱验证令牌有默认的过期时间，通常为 24 小时。如果用户在此时间内未点击链接，则会过期。

### Q: 如何延长验证链接的有效期？
A: 在 Supabase Dashboard 的 Auth Settings 中调整 JWT Expiry 设置。

### Q: 用户可以重新请求验证邮件吗？
A: 是的，应用现在包含了重新发送验证邮件的功能。

### Q: 如何处理生产环境和开发环境的不同配置？
A: 在不同环境中设置不同的环境变量，确保 Site URL 和 Redirect URLs 匹配相应环境的域名。

## 联系支持

如果问题仍然存在，请：
1. 检查 Supabase 项目的配置截图
2. 提供完整的错误信息
3. 确认环境变量配置
4. 检查网络控制台是否有其他错误 