#!/usr/bin/env node

import { spawn } from 'child_process'
import path from 'path'

console.log('🚀 Starting Prompt Optimizer...\n')

// Start the backend server
console.log('📡 Starting backend server...')
const server = spawn('node', ['server/index.js'], {
  stdio: 'inherit',
  cwd: process.cwd()
})

// Wait a bit for server to start
setTimeout(() => {
  console.log('🎨 Starting frontend development server...')
  // Start the frontend dev server
  const frontend = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd()
  })

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...')
    server.kill('SIGINT')
    frontend.kill('SIGINT')
    process.exit(0)
  })

  frontend.on('close', (code) => {
    console.log(`Frontend process exited with code ${code}`)
    server.kill('SIGINT')
  })

  server.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`)
    frontend.kill('SIGINT')
  })

}, 2000)

server.on('close', (code) => {
  console.log(`Backend server exited with code ${code}`)
}) 