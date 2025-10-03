#!/bin/bash

# Script para desplegar la aplicación IPv4 Calculator en puerto 80
# Requiere permisos de administrador para usar puerto 80

echo "🚀 Iniciando despliegue de IPv4 Calculator..."

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor, instala Node.js primero."
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor, instala npm primero."
    exit 1
fi

echo "📦 Instalando dependencias..."
npm install

echo "🔨 Construyendo la aplicación..."
npm run build

echo "🌐 Iniciando servidor en puerto 80..."
echo "⚠️  Nota: Se requieren permisos de administrador para usar el puerto 80"

# En Linux, usar sudo para puerto 80
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Detectado sistema Linux - usando sudo para puerto 80"
    sudo npm start
else
    echo "🪟 Sistema no Linux - iniciando sin sudo"
    npm start
fi