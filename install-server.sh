#!/bin/bash

# Script de instalación para Rocky Linux 9
# Redes de Datos 1 - 246827
# Ejecutar con: sudo bash install-server.sh

if [ "$EUID" -ne 0 ]; then 
   echo "Por favor ejecuta como root o con sudo"
   exit 1
fi

echo "==================================="
echo "Instalación Calculadora IPv4"
echo "Rocky Linux 9"
echo "==================================="
echo ""

# Variables
APP_DIR="/var/www/ipv4-calculator"
SERVICE_USER="nodejs"
PORT=3000

echo "📦 Instalando Node.js..."
dnf module install -y nodejs:20
dnf install -y npm

echo ""
echo "📁 Creando directorio de aplicación..."
mkdir -p "$APP_DIR"

echo ""
echo "📤 Por favor, extrae el archivo ipv4-calculator.tar.gz en $APP_DIR"
echo "   Ejemplo: tar -xzf ipv4-calculator.tar.gz -C $APP_DIR"
read -p "Presiona Enter cuando hayas extraído los archivos..."

cd "$APP_DIR" || exit 1

echo ""
echo "📥 Instalando dependencias..."
npm ci --omit=dev

echo ""
echo "👤 Creando usuario del sistema..."
if ! id "$SERVICE_USER" &>/dev/null; then
    useradd -r -s /bin/false "$SERVICE_USER"
fi

chown -R "$SERVICE_USER:$SERVICE_USER" "$APP_DIR"

echo ""
echo "⚙️  Creando servicio systemd..."
cat > /etc/systemd/system/ipv4-calculator.service <<EOF
[Unit]
Description=Calculadora IPv4 - Redes de Datos 1
After=network.target

[Service]
Type=simple
User=$SERVICE_USER
WorkingDirectory=$APP_DIR
Environment="PORT=$PORT"
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

echo ""
echo "🔥 Configurando firewall..."
firewall-cmd --zone=public --add-forward-port=port=80:proto=tcp:toport=$PORT --permanent
firewall-cmd --reload

echo ""
echo "🚀 Iniciando servicio..."
systemctl daemon-reload
systemctl enable ipv4-calculator
systemctl start ipv4-calculator

echo ""
echo "⏳ Esperando que el servicio inicie..."
sleep 3

echo ""
echo "✅ Estado del servicio:"
systemctl status ipv4-calculator --no-pager

echo ""
echo "==================================="
echo "✅ Instalación completada!"
echo "==================================="
echo ""
echo "📡 La aplicación debería estar corriendo en:"
echo "   http://localhost"
echo "   http://$(hostname -I | awk '{print $1}')"
echo ""
echo "🔧 Comandos útiles:"
echo "   Ver logs:     sudo journalctl -u ipv4-calculator -f"
echo "   Reiniciar:    sudo systemctl restart ipv4-calculator"
echo "   Detener:      sudo systemctl stop ipv4-calculator"
echo "   Estado:       sudo systemctl status ipv4-calculator"
echo ""
echo "🧪 Prueba la aplicación:"
echo "   curl http://localhost"
echo ""

