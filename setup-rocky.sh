#!/bin/bash

# Script de instalación y configuración para Rocky Linux 9
# IPv4 Calculator - Calculadora de redes IPv4

echo "🐧 Configurando IPv4 Calculator en Rocky Linux 9..."

# Actualizar el sistema
echo "📱 Actualizando el sistema..."
sudo dnf update -y

# Instalar Git
echo "🔧 Instalando Git..."
sudo dnf install -y curl wget git vim

# Instalar Node.js y npm
echo "📦 Instalando Node.js y npm..."
sudo curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# Verificar instalación
echo "✅ Verificando instalación..."
node --version
npm --version

# Clonar repositorio github
git clone https://github.com/Nick220505/ipv4-calculator.git
