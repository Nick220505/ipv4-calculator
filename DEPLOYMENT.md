# Guía de Despliegue - Calculadora IPv4

## 📦 Archivos a Subir

Debes comprimir y subir los siguientes archivos/carpetas:

```
ipv4-calculator/
├── .next/              (generado con npm run build)
├── public/
├── src/
├── node_modules/       (o instalar en el servidor)
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
└── postcss.config.mjs
```

## 🚀 Opción 1: Despliegue con Node.js (RECOMENDADA)

### En tu máquina local:

```bash
# 1. Construir el proyecto
npm run build

# 2. Crear archivo comprimido (incluir archivos necesarios)
# Desde el directorio del proyecto
tar -czf ipv4-calculator.tar.gz .next public package*.json next.config.ts tsconfig.json postcss.config.mjs src
```

### En el servidor Rocky Linux 9:

```bash
# 1. Instalar Node.js y npm
sudo dnf module install nodejs:20
sudo dnf install npm

# 2. Extraer el archivo
tar -xzf ipv4-calculator.tar.gz -C /var/www/ipv4-calculator
cd /var/www/ipv4-calculator

# 3. Instalar dependencias de producción
npm ci --omit=dev

# 4. Iniciar en puerto 80 (requiere sudo o configurar privilegios)
sudo PORT=80 npm start

# O usar un puerto normal y redirigir con firewall:
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
