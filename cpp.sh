#!/bin/bash

# 检查是否提供了标题
if [ -z "$1" ]; then
    echo "用法: ./cpp.sh \"文章标题\""
    exit 1
fi

TITLE=$1
# 转换标题为 URL 友好的 slug（移除特殊字符）
SLUG=$(echo "$TITLE" | tr ' ' '-' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]//g')
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H:%M:%S)
FILENAME="_posts/cpp/${DATE}-${SLUG}.md"

# 确保 _posts/cpp 目录存在
mkdir -p _posts/cpp

cat > "$FILENAME" << EOF
---
title:              "《Learn C++》笔记 ${TITLE}"
date:               ${DATE} ${TIME}
last_modified_at:   ${DATE} ${TIME}
toc:                true
categories:         [C++, Introduction/Getting Started]
tags:               [cpp, introduction getting-started, ]

---

正文从这里开始
EOF

echo "✅ 创建成功: $(pwd)/$FILENAME"

# 切换到目标目录
cd _posts/cpp/
exec bash
