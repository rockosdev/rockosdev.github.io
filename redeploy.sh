#!/bin/bash

msg=${1:-"Update blog $(date +'%Y-%m-%d %H:%M:%S')"}

echo -e "\033[0;32m>> 开始部署到 GitHub...\033[0m"

git add .
git commit -m "$msg"

# 确保使用 credential helper，避免脚本中无法提示输入
export GIT_TERMINAL_PROMPT=1
git config credential.helper store

git push origin main

echo -e "\033[0;32m>> 部署完成！GitHub Pages 正在构建中...\033[0m"
