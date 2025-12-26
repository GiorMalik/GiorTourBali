#!/bin/bash

# Script untuk memperbaiki semua penggunaan t() tanpa type casting
# Mengubah {t('key')} menjadi {t('key') as string}

FILES=$(find src/ -name "*.tsx" -type f -exec grep -l "t('" {} \;)

for file in $FILES; do
    echo "Memproses: $file"
    
    # Gunakan sed untuk mengganti {t( menjadi {t( as string
    sed -i "s/{t('\([^']*\)')}/{t('\1') as string}/g" "$file"
    
    echo "Selesai: $file"
done

echo ""
echo "Total file yang diproses: $(echo "$FILES" | wc -w)"
echo "✅ Selesai"
