#!/bin/bash

[ -z "$1" ] && { echo "用法: $0 \"标题\""; exit 1; }

TITLE="$1"

# 只替换空格为横线，保留所有其他字符（包括中文）
SLUG=$(echo "$TITLE" | sed 's/ /-/g' | sed 's/[\/\\:*?"<>|]//g')

# 如果处理后为空，用时间戳
[ -z "$SLUG" ] && SLUG="post-$(date +%s)"

DATE=$(date +%Y-%m-%d)
TIME=$(date +%H:%M:%S)
FILE="_posts/cpp/${DATE}-${SLUG}.md"
mkdir -p "_posts/cpp"

{
    echo "---"
    echo "title:              \"《Learn C++》笔记 0.0${TITLE}\""
    echo "date:               ${DATE} ${TIME}"
    echo "last_modified_at:   ${DATE} ${TIME}"
    echo "toc:                true"
    echo "categories:         [C++, 01 C++ Basics]"
    echo "tags:               [cpp]"
    echo "---"
    echo ""
    echo "正文从这里开始"
} > "$FILE"

echo "✅ 创建: $(pwd)/$FILE"
cd "_posts/cpp" && exec bash
