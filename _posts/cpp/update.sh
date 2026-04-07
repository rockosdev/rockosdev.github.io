#!/bin/bash

FILEPATH="${1:-}"

if [ -z "$FILEPATH" ]; then
    echo "❌ 需要文件路径"
    exit 1
fi

# 相对路径直接可用（因为脚本和文件同目录）
if [ ! -f "$FILEPATH" ]; then
    echo "❌ 文件不存在: $FILEPATH"
    exit 1
fi

NEW_DATE=$(date +%Y-%m-%d)
NEW_TIME=$(date +%H:%M:%S)

sed -i "s/last_modified_at:.*/last_modified_at:   ${NEW_DATE} ${NEW_TIME}/" "$FILEPATH"

echo "✅ 已更新: $FILEPATH"
echo "   last_modified_at: ${NEW_DATE} ${NEW_TIME}"
