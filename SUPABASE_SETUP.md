-- 创建索引优化查询性能
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_created_at ON favorites(created_at DESC);

-- OAuth Sessions 表用于管理 OAuth 提供商会话
CREATE TABLE oauth_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  provider_user_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_type VARCHAR(50) DEFAULT 'Bearer',
  scope TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  provider_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(provider, provider_user_id)
);

-- OAuth Tokens 表用于存储额外的令牌信息
CREATE TABLE oauth_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  oauth_session_id UUID REFERENCES oauth_sessions(id) ON DELETE CASCADE,
  token_type VARCHAR(50) NOT NULL, -- 'access', 'refresh', 'id_token'
  token_value TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(oauth_session_id, token_type)
);

-- 启用行级安全
ALTER TABLE oauth_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_tokens ENABLE ROW LEVEL SECURITY;

-- oauth_sessions 的 RLS 策略
CREATE POLICY "Users can view their own OAuth sessions" 
ON oauth_sessions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own OAuth sessions" 
ON oauth_sessions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own OAuth sessions" 
ON oauth_sessions FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own OAuth sessions" 
ON oauth_sessions FOR DELETE 
USING (auth.uid() = user_id);

-- oauth_tokens 的 RLS 策略
CREATE POLICY "Users can view their own OAuth tokens" 
ON oauth_tokens FOR SELECT 
USING (
  oauth_session_id IN (
    SELECT id FROM oauth_sessions WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage their own OAuth tokens" 
ON oauth_tokens FOR ALL 
USING (
  oauth_session_id IN (
    SELECT id FROM oauth_sessions WHERE user_id = auth.uid()
  )
);

-- 性能优化索引
CREATE INDEX idx_oauth_sessions_user_id ON oauth_sessions(user_id);
CREATE INDEX idx_oauth_sessions_provider ON oauth_sessions(provider);
CREATE INDEX idx_oauth_sessions_expires_at ON oauth_sessions(expires_at);
CREATE INDEX idx_oauth_tokens_session_id ON oauth_tokens(oauth_session_id);
CREATE INDEX idx_oauth_tokens_expires_at ON oauth_tokens(expires_at);

-- 更新 updated_at 时间戳的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 自动更新 updated_at 的触发器
CREATE TRIGGER update_oauth_sessions_updated_at BEFORE UPDATE
ON oauth_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 6. 测试配置