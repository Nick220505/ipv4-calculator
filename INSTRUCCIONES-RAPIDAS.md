# 📋 Instrucciones Rápidas - Despliegue

## Para el Estudiante (Windows/Local)

### 1️⃣ Crear el paquete

```bash
# En Windows (desde Git Bash o PowerShell)
npm run build
```

### 2️⃣ Comprimir archivos

**Comprimir ESTOS archivos/carpetas en un ZIP o TAR.GZ:**

- ✅ `.next/` (carpeta generada por el build)
- ✅ `public/`
- ✅ `package.json`
- ✅ `package-lock.json`
- ✅ `next.config.ts`
- ✅ `tsconfig.json`
- ✅ `postcss.config.mjs`
- ✅ `install-server.sh` (opcional, para instalación automática)

**Usando 7-Zip, WinRAR o el script:**

```bash
./create-package.bat
```

### 3️⃣ Subir al servidor

Transfiere el archivo `.zip` o `.tar.gz` a tu VM de Rocky Linux 9.

---

## En el Servidor Rocky Linux 9

### Método Rápido (Con el script)

```bash
# 1. Extraer archivos
sudo mkdir -p /var/www/ipv4-calculator
sudo tar -xzf ipv4-calculator-*.tar.gz -C /var/www/ipv4-calculator

# 2. Ejecutar script de instalación
sudo bash install-server.sh
```

### Método Manual

```bash
# 1. Instalar Node.js
sudo dnf module install -y nodejs:20
sudo dnf install -y npm

# 2. Extraer archivos
sudo mkdir -p /var/www/ipv4-calculator
sudo tar -xzf ipv4-calculator-*.tar.gz -C /var/www/ipv4-calculator
cd /var/www/ipv4-calculator

# 3. Instalar dependencias
npm ci --omit=dev

# 4. Crear servicio
sudo nano /etc/systemd/system/ipv4-calculator.service
```

**Contenido del servicio:**

```ini
[Unit]
Description=Calculadora IPv4
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/ipv4-calculator
Environment="PORT=3000"
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

**Continuar:**

```bash
# 5. Configurar firewall (redirigir puerto 80 -> 3000)
sudo firewall-cmd --zone=public --add-forward-port=port=80:proto=tcp:toport=3000 --permanent
sudo firewall-cmd --reload

# 6. Iniciar servicio
sudo systemctl daemon-reload
sudo systemctl enable ipv4-calculator
sudo systemctl start ipv4-calculator

# 7. Verificar
sudo systemctl status ipv4-calculator
curl http://localhost
```

---

## ✅ Verificar que funciona

Desde el servidor:

```bash
curl http://localhost
```

Desde otra máquina en la red:

```bash
# Obtener IP del servidor
ip addr show

# Desde tu máquina, abrir en navegador:
http://IP_DEL_SERVIDOR
```

---

## 🔧 Solución de Problemas

### El servicio no arranca

```bash
# Ver logs
sudo journalctl -u ipv4-calculator -n 50

# Verificar puerto
sudo ss -tlnp | grep 3000
```

### No puedo acceder desde otra máquina

```bash
# Verificar firewall
sudo firewall-cmd --list-all

# Agregar puerto manualmente
sudo firewall-cmd --zone=public --add-port=80/tcp --permanent
sudo firewall-cmd --reload
```

### Error de permisos

```bash
# Dar permisos a la carpeta
sudo chown -R $USER:$USER /var/www/ipv4-calculator
```

---

## 📝 Comandos Útiles

```bash
# Ver logs en tiempo real
sudo journalctl -u ipv4-calculator -f

# Reiniciar servicio
sudo systemctl restart ipv4-calculator

# Detener servicio
sudo systemctl stop ipv4-calculator

# Ver estado
sudo systemctl status ipv4-calculator

# Ver IP del servidor
hostname -I
```

---

## 🎯 Checklist de Entrega

- [ ] Archivo comprimido creado (.zip o .tar.gz)
- [ ] Contiene carpeta `.next`
- [ ] Contiene `package.json` y `package-lock.json`
- [ ] Contiene archivos de configuración
- [ ] La página principal es `index.html` (generada automáticamente en `.next`)
- [ ] Funciona en el servidor Rocky Linux 9
- [ ] Accesible en puerto 80
- [ ] Calculadora funciona correctamente
- [ ] Muestra resultados binarios con colores

---

**📧 Asignatura:** Redes de Datos 1 - 246827  
**📅 Vencimiento:** 5 de octubre de 2025 a las 23:59
