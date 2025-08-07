-- 创建索引优化查询性能
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_created_at ON favorites(created_at DESC);

-- 用户资料表（扩展 auth.users）
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  preferences JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_valid CHECK (username ~ '^[a-zA-Z0-9_-]+$')
);

-- OAuth 提供商表（支持第三方登录）
CREATE TABLE IF NOT EXISTS public.oauth_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  provider_email TEXT,
  provider_data JSONB DEFAULT '{}',
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(provider, provider_id),
  UNIQUE(user_id, provider)
);

-- 为用户资料和 OAuth 表创建索引
CREATE INDEX idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX idx_oauth_providers_user_id ON public.oauth_providers(user_id);
CREATE INDEX idx_oauth_providers_provider ON public.oauth_providers(provider);

-- 启用 RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_providers ENABLE ROW LEVEL SECURITY;

-- 用户资料 RLS 策略
CREATE POLICY "Users can view all profiles" ON public.user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- OAuth 提供商 RLS 策略
CREATE POLICY "Users can view own providers" ON public.oauth_providers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own providers" ON public.oauth_providers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own providers" ON public.oauth_providers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own providers" ON public.oauth_providers
  FOR DELETE USING (auth.uid() = user_id);

-- 自动创建用户资料的函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 注册时自动创建用户资料的触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 更新 updated_at 时间戳的函数
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 自动更新 updated_at 的触发器
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_oauth_providers_updated_at
  BEFORE UPDATE ON public.oauth_providers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

## 6. 测试配置