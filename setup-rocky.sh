#!/bin/bash

# Script de instalación y configuración para Rocky Linux 9
# IPv4 Calculator - Calculadora de redes IPv4

echo "🐧 Configurando IPv4 Calculator en Rocky Linux 9..."

# Actualizar el sistema
echo "📱 Actualizando el sistema..."
sudo dnf update -y

# Instalar Node.js y npm
echo "📦 Instalando Node.js y npm..."
sudo dnf module install nodejs:18 npm -y

# Verificar instalación
echo "✅ Verificando instalación..."
node --version
npm --version

# Crear directorio para la aplicación
echo "📁 Creando directorio de aplicación..."
sudo mkdir -p /var/www/ipv4-calculator
sudo chown $USER:$USER /var/www/ipv4-calculator

# Navegar al directorio
cd /var/www/ipv4-calculator

echo "📋 Instrucciones para continuar:"
echo "1. Copia todos los archivos de tu proyecto a /var/www/ipv4-calculator"
echo "2. Ejecuta: npm install"
echo "3. Ejecuta: npm run build"
echo "4. Para iniciar en puerto 80: sudo npm start"
echo ""
echo "🔥 Comandos útiles:"
echo "   - Para ver procesos en puerto 80: sudo netstat -tlnp | grep :80"
echo "   - Para detener proceso: sudo pkill -f node"
echo "   - Para ver logs: sudo journalctl -f"
echo ""
echo "⚡ ¡Configuración inicial completada!"