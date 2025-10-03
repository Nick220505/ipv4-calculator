# Guía de Despliegue - Calculadora IPv4
## Redes de Datos 1 - Puerto 80

## 🎯 Objetivo
Desplegar calculadora IPv4 en Rocky Linux 9 en puerto 80.

## 📦 Crear Paquete para Subir

### 1. Preparar archivos (en tu máquina Windows):

```bash
# Construir la aplicación
npm run build

# Crear paquete comprimido
./create-package.sh
```

Esto generará un archivo `ipv4-calculator-YYYYMMDD-HHMMSS.tar.gz` con todos los archivos necesarios.

## � Instalación en Rocky Linux 9

### 1. Configuración inicial del servidor:

```bash
# Ejecutar script de configuración
chmod +x setup-rocky.sh
./setup-rocky.sh
```

### 2. Instalar la aplicación:

```bash
# Extraer el paquete
sudo tar -xzf ipv4-calculator-*.tar.gz -C /var/www/ipv4-calculator/

# Cambiar al directorio
cd /var/www/ipv4-calculator

# Instalar dependencias
npm install --production

# Construir si es necesario
npm run build
```

### 3. Iniciar en puerto 80:

#### Opción A: Inicio manual
```bash
sudo npm start
```

#### Opción B: Como servicio (RECOMENDADO)
```bash
# Copiar archivo de servicio
sudo cp ipv4-calculator.service /etc/systemd/system/

# Habilitar y iniciar servicio
sudo systemctl daemon-reload
sudo systemctl enable ipv4-calculator
sudo systemctl start ipv4-calculator

# Verificar estado
sudo systemctl status ipv4-calculator
```

## 🔧 Comandos Útiles

```bash
# Ver logs del servicio
sudo journalctl -u ipv4-calculator -f

# Reiniciar servicio
sudo systemctl restart ipv4-calculator

# Detener servicio
sudo systemctl stop ipv4-calculator

# Ver qué proceso usa puerto 80
sudo netstat -tlnp | grep :80

# Verificar firewall
sudo firewall-cmd --list-all
sudo firewall-cmd --add-port=80/tcp --permanent
sudo firewall-cmd --reload
```

## 🌐 Acceso a la Aplicación

Una vez iniciada, accede a: `http://IP_DEL_SERVIDOR`

## 📋 Características Implementadas

✅ Entrada IP en formato decimal (X.X.X.X)  
✅ Entrada máscara en formato (X.X.X.X)  
✅ Cálculo de IP de red  
✅ Cálculo de IP de broadcast  
✅ Cantidad de IPs útiles/hosts  
✅ Rango de IPs útiles  
✅ Clasificación de IP (A, B, C, D, E)  
✅ Detección IP pública/privada  
✅ Visualización binaria de red y host  
✅ Puerto 80 configurado  

## 🎓 Para la Sustentación

1. **Demostrar funcionamiento**: Probar con diferentes IPs y máscaras
2. **Mostrar código**: Explicar la lógica de cálculo
3. **Explicar despliegue**: Cómo se configuró en Rocky Linux 9
4. **Responder preguntas**: Estar preparado para defender las decisiones técnicas
PORT=3000 npm start &
sudo firewall-cmd --zone=public --add-forward-port=port=80:proto=tcp:toport=3000 --permanent
sudo firewall-cmd --reload
```

### Configurar como servicio systemd (para que corra automáticamente):

Crear archivo `/etc/systemd/system/ipv4-calculator.service`:

```ini
[Unit]
Description=IPv4 Calculator
After=network.target

[Service]
Type=simple
User=nodejs
WorkingDirectory=/var/www/ipv4-calculator
Environment="PORT=3000"
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Luego:

```bash
# Crear usuario
sudo useradd -r -s /bin/false nodejs
sudo chown -R nodejs:nodejs /var/www/ipv4-calculator

# Habilitar y arrancar el servicio
sudo systemctl daemon-reload
sudo systemctl enable ipv4-calculator
sudo systemctl start ipv4-calculator

# Configurar firewall para redirigir puerto 80 -> 3000
sudo firewall-cmd --zone=public --add-forward-port=port=80:proto=tcp:toport=3000 --permanent
sudo firewall-cmd --reload
```

## 🌐 Opción 2: Exportación Estática (más simple, sin Node.js)

### Configurar Next.js para exportación estática:

Modificar `next.config.ts`:

```typescript
const nextConfig = {
  output: "export",
  trailingSlash: true,
};
```

Luego:

```bash
# Construir como sitio estático
npm run build

# Esto crea la carpeta "out" con archivos HTML/JS/CSS estáticos
```

### En el servidor Rocky Linux 9:

```bash
# 1. Instalar Apache o Nginx
sudo dnf install httpd
sudo systemctl enable httpd
sudo systemctl start httpd

# 2. Copiar archivos al directorio web
sudo cp -r out/* /var/www/html/

# 3. Configurar SELinux si está activo
sudo chcon -R -t httpd_sys_content_t /var/www/html/

# 4. Configurar firewall
sudo firewall-cmd --zone=public --add-service=http --permanent
sudo firewall-cmd --reload
```

El archivo principal sería `index.html` (Next.js lo genera automáticamente).

## ✅ Verificar Funcionamiento

```bash
# Desde el servidor
curl http://localhost

# Desde otra máquina en la red
curl http://<IP_DEL_SERVIDOR>
```

## 📝 Notas Importantes

1. **Puerto 80**: Requiere privilegios de root. Alternativa: usar puerto 3000+ y redirigir.
2. **Firewall**: Rocky Linux tiene firewalld activo por defecto.
3. **SELinux**: Puede bloquear acceso a archivos web, configurar con `chcon` o `semanage`.
4. **Nombre del archivo**: Next.js genera `index.html` automáticamente, cumple con el requisito.

## 🔧 Comandos Útiles

```bash
# Ver logs del servicio
sudo journalctl -u ipv4-calculator -f

# Reiniciar servicio
sudo systemctl restart ipv4-calculator

# Verificar estado
sudo systemctl status ipv4-calculator

# Ver qué proceso usa el puerto 80
sudo ss -tlnp | grep :80
```
