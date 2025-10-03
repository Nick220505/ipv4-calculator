#!/bin/bash

# Script para crear el paquete de despliegue
# Redes de Datos 1 - 246827

echo "🔨 Construyendo proyecto..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error en el build"
    exit 1
fi

echo "📦 Creando archivo comprimido..."

# Nombre del archivo con fecha
FILENAME="ipv4-calculator-$(date +%Y%m%d-%H%M%S).tar.gz"

# Comprimir archivos necesarios
tar -czf "$FILENAME" \
    .next \
    public \
    package.json \
    package-lock.json \
    next.config.ts \
    tsconfig.json \
    postcss.config.mjs \
    deploy.sh \
    setup-rocky.sh \
    ipv4-calculator.service \
    DEPLOYMENT.md

echo "✅ Paquete creado: $FILENAME"
echo ""
echo "📋 Contenido del paquete:"
tar -tzf "$FILENAME" | head -20
echo "..."
echo ""
echo "📤 Sube este archivo a tu servidor Rocky Linux 9"
echo "📖 Lee DEPLOYMENT.md para instrucciones de instalación"

