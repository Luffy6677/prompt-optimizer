import { supabase } from './supabase.js'

// Check if Supabase is configured
if (!supabase) {
  console.warn('⚠️ Supabase not configured - favorites functionality will not work')
}

// Favorites table structure:
// - id: uuid (primary key)
// - user_id: uuid (references auth.users)
// - prompt: text
// - optimized_prompt: text
// - created_at: timestamp

// Favorites service

// Add to favorites
export async function addToFavorites(userId, prompt, optimizedPrompt) {
  if (!supabase) {
    console.warn('⚠️ Supabase not configured - cannot add to favorites')
    return { success: false, error: 'Favorites not available' }
  }

  try {
    console.log('📌 Adding to favorites:', { userId, prompt: prompt.substring(0, 50) + '...' })
    
    const { data, error } = await supabase
      .from('favorites')
      .insert([
        {
          user_id: userId,
          prompt: prompt,
          optimized_prompt: optimizedPrompt,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('❌ Error adding to favorites:', error)
      
      // Safely check error type
      const errorMessage = error?.message || ''
      const errorCode = error?.code || ''
      const errorStatus = error?.status || 0
      
      // Check if table doesn't exist error
      // 404 status usually indicates table doesn't exist
      if (errorStatus === 404 || 
          errorCode === 'PGRST116' ||
          errorMessage.includes('relation') && errorMessage.includes('does not exist') ||
          errorMessage.includes('table') && errorMessage.includes('not found') ||
          errorMessage.includes('undefined') ||
          (typeof error === 'object' && error !== null && 
           Object.keys(error).length === 0)) { // Empty error object might also indicate table doesn't exist
        
        return { 
          success: false, 
          error: 'Favorites table not yet created. Please contact administrator.' 
        }
      }
      
      // If it's an error we threw, re-throw it directly
      if (error instanceof Error) {
        return { success: false, error: error.message }
      }
      
      // Other unknown exceptions
      return { success: false, error: 'Failed to add to favorites' }
    }

    console.log('✅ Successfully added to favorites:', data)
    return { success: true, data: data[0] }
  } catch (error) {
    console.error('❌ Exception adding to favorites:', error)
    return { success: false, error: error.message || 'Unknown error' }
  }
}

// Get user favorites list
export async function getFavorites(userId) {
  if (!supabase) {
    console.warn('⚠️ Supabase not configured - cannot get favorites')
    return { success: false, error: 'Favorites not available' }
  }

  try {
    console.log('📋 Getting favorites for user:', userId)
    
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error getting favorites:', error)
      
      // Safely check error type
      const errorMessage = error?.message || ''
      const errorCode = error?.code || ''
      const errorStatus = error?.status || 0
      
      // Check if table doesn't exist error
      if (errorStatus === 404 || 
          errorCode === 'PGRST116' ||
          errorMessage.includes('relation') && errorMessage.includes('does not exist') ||
          errorMessage.includes('table') && errorMessage.includes('not found')) {
        
        return { 
          success: true, 
          data: [], // Return empty array when table doesn't exist
          message: 'Favorites table not yet created'
        }
      }
      
      return { success: false, error: error.message || 'Failed to get favorites' }
    }

    console.log(`✅ Retrieved ${data?.length || 0} favorites`)
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('❌ Exception getting favorites:', error)
    return { success: false, error: error.message || 'Unknown error' }
  }
}

// Remove from favorites
export async function removeFromFavorites(userId, favoriteId) {
  if (!supabase) {
    console.warn('⚠️ Supabase not configured - cannot remove from favorites')
    return { success: false, error: 'Favorites not available' }
  }

  try {
    console.log('🗑️ Removing from favorites:', { userId, favoriteId })
    
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', favoriteId)
      .eq('user_id', userId) // Security: ensure user can only delete their own favorites

    if (error) {
      console.error('❌ Error removing from favorites:', error)
      return { success: false, error: error.message || 'Failed to remove from favorites' }
    }

    console.log('✅ Successfully removed from favorites')
    return { success: true }
  } catch (error) {
    console.error('❌ Exception removing from favorites:', error)
    return { success: false, error: error.message || 'Unknown error' }
  }
}

// 检查Supabase是否配置
const checkSupabaseConfig = () => {
  if (!supabase) {
    console.error('❌ Supabase not configured')
    return {
      isConfigured: false,
      error: 'Supabase not configured. Favorites feature unavailable. Please configure Supabase to enable favorites.'
    }
  }
  return { isConfigured: true }
}

// 收藏服务
export const favoritesService = {
  // 添加收藏
  addFavorite: async (favoriteData) => {
    const configCheck = checkSupabaseConfig()
    if (!configCheck.isConfigured) {
      throw new Error(configCheck.error)
    }
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert([{
          title: favoriteData.title,
          original_prompt: favoriteData.originalPrompt,
          optimized_prompt: favoriteData.optimizedPrompt,
          strategy: favoriteData.strategy,
          scores: favoriteData.scores,
          analysis: favoriteData.analysis,
          alternatives: favoriteData.alternatives,
          user_id: favoriteData.userId
        }])
        .select()
        .single()
      
      if (error) {
        console.error('❌ Failed to add favorite, Supabase error:', error)
        
        // 安全地检查错误类型
        const errorCode = error.code || ''
        const errorMessage = error.message || ''
        const errorStatus = error.status || 0
        
        // 检查是否是表不存在的错误
        // 404状态码通常表示表不存在
        if (errorStatus === 404 || 
            errorCode === 'PGRST116' || 
            errorMessage.includes('relation') || 
            errorMessage.includes('does not exist') ||
            errorMessage.includes('table') ||
            errorMessage.includes('not found') ||
            (Object.keys(error).length === 0)) { // 空错误对象也可能表示表不存在
          throw new Error('Favorites table does not exist. Please follow these steps to create it:\n1. Login to Supabase console\n2. Go to SQL Editor\n3. Execute the table creation SQL from SUPABASE_SETUP.md')
        }
        
        throw new Error(`Failed to add favorite: ${errorMessage || errorCode || `HTTP ${errorStatus}` || 'Unknown error'}`)
      }
      
      return data
    } catch (err) {
      console.error('❌ addFavorite exception:', err)
      // 如果是我们抛出的错误，直接重新抛出
      if (err.message.includes('Failed to add favorite') || err.message.includes('Favorites table does not exist')) {
        throw err
      }
      // 其他未知异常
      throw new Error(`Failed to add favorite: ${err.message || err.toString()}`)
    }
  },

  // 获取用户收藏列表
  getFavorites: async (userId) => {
    const configCheck = checkSupabaseConfig()
    if (!configCheck.isConfigured) {
      return { data: [], error: configCheck.error, isConfigError: true }
    }
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) {
        // 安全地检查错误类型
        const errorCode = error.code || ''
        const errorMessage = error.message || ''
        const errorStatus = error.status || 0
        
        // 检查是否是表不存在的错误
        if (errorStatus === 404 || 
            errorCode === 'PGRST116' || 
            errorMessage.includes('relation') || 
            errorMessage.includes('does not exist') ||
            errorMessage.includes('table') ||
            errorMessage.includes('not found') ||
            (Object.keys(error).length === 0)) {
          return { 
            data: [], 
            error: 'Favorites table does not exist. Please follow these steps to create it:\n1. Login to Supabase console\n2. Go to SQL Editor\n3. Execute the table creation SQL from SUPABASE_SETUP.md',
            isConfigError: true 
          }
        }
        return { data: [], error: `Failed to load favorites: ${errorMessage || errorCode || `HTTP ${errorStatus}` || 'Unknown error'}`, isConfigError: false }
      }
      
      return { data: data || [], error: null, isConfigError: false }
    } catch (err) {
      return { 
        data: [], 
        error: `Failed to load favorites: ${err.message || err.code || 'Unknown error'}`, 
        isConfigError: false 
      }
    }
  },

  // 删除收藏
  deleteFavorite: async (favoriteId) => {
    const configCheck = checkSupabaseConfig()
    if (!configCheck.isConfigured) {
      throw new Error(configCheck.error)
    }
    
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', favoriteId)
    
    if (error) {
      throw new Error(`Failed to delete favorite: ${error.message || error.code || 'Unknown error'}`)
    }
  },

  // 更新收藏标题
  updateFavoriteTitle: async (favoriteId, newTitle) => {
    const configCheck = checkSupabaseConfig()
    if (!configCheck.isConfigured) {
      throw new Error(configCheck.error)
    }
    
    const { data, error } = await supabase
      .from('favorites')
      .update({ 
        title: newTitle,
        updated_at: new Date().toISOString()
      })
      .eq('id', favoriteId)
      .select()
      .single()
    
    if (error) {
      throw new Error(`Failed to update title: ${error.message || error.code || 'Unknown error'}`)
    }
    return data
  },

  // 检查是否已收藏（基于优化后的提示词内容）
  checkIfFavorited: async (userId, optimizedPrompt) => {
    const configCheck = checkSupabaseConfig()
    if (!configCheck.isConfigured) {
      return false // 未配置时默认未收藏
    }
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('optimized_prompt', optimizedPrompt)
        .maybeSingle()
      
      if (error) return false
      return !!data
    } catch (err) {
      return false
    }
  },

  // 检查收藏功能是否可用
  isAvailable: () => {
    return checkSupabaseConfig().isConfigured
  },

  // 根据用户ID和优化提示词删除收藏（用于取消收藏）
  removeFavoriteByContent: async (userId, optimizedPrompt) => {
    const configCheck = checkSupabaseConfig()
    if (!configCheck.isConfigured) {
      throw new Error(configCheck.error)
    }
    
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('optimized_prompt', optimizedPrompt)
      
      if (error) {
        console.error('❌ Failed to remove favorite, Supabase error:', error)
        throw new Error(`Failed to remove favorite: ${error.message || error.code || 'Unknown error'}`)
      }
    } catch (err) {
      console.error('❌ removeFavoriteByContent exception:', err)
      if (err.message.includes('Failed to remove favorite')) {
        throw err
      }
      throw new Error(`Failed to remove favorite: ${err.message || err.toString()}`)
    }
  },
} 