#!/bin/bash

# Script para generar versión estática exportable
echo "🔄 Generando versión estática..."

# Modificar next.config.ts temporalmente para exportación estática
cp next.config.ts next.config.ts.backup

cat > next.config.ts << 'EOF'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
EOF

# Construir versión estática
npm run build

# Restaurar configuración original
mv next.config.ts.backup next.config.ts

# Crear paquete con versión estática
if [ -d "out" ]; then
    STATIC_FILENAME="ipv4-calculator-static-$(date +%Y%m%d-%H%M%S).tar.gz"
    tar -czf "$STATIC_FILENAME" out/
    echo "✅ Versión estática creada: $STATIC_FILENAME"
    echo "📁 Contiene archivos HTML estáticos que puedes subir a cualquier servidor web"
    
    # Renombrar index.html
    cp out/index.html out/index.html.backup
    echo "📝 index.html disponible en out/index.html"
else
    echo "❌ No se pudo generar la versión estática"
fi