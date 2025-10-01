# Calculadora IPv4

**Redes de Datos 1 - 246827**

Aplicación web para calcular información de redes IPv4, desarrollada con Next.js y Tailwind CSS.

## 📋 Características

La calculadora permite ingresar una dirección IP y máscara de subred en formato decimal (X.X.X.X) y calcula:

- ✅ IP de Red
- ✅ IP de Broadcast
- ✅ Cantidad de hosts útiles
- ✅ Rango de IPs útiles (ej: 192.168.0.1 - 192.168.0.254)
- ✅ Clase de IP (A hasta E)
- ✅ Tipo de IP (Pública o Privada)
- ✅ Representación binaria con visualización de porción de red y hosts

## 🚀 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Abrir en el navegador
http://localhost:3000
```

## 📦 Crear Paquete para Despliegue

### En Windows:
```bash
# Ejecutar el script de empaquetado
./create-package.bat
```

### En Linux/Mac:
```bash
# Dar permisos de ejecución
chmod +x create-package.sh

# Ejecutar el script
./create-package.sh
```

Esto creará un archivo `.tar.gz` o `.zip` con todos los archivos necesarios.

## 🖥️ Despliegue en Rocky Linux 9

### Opción 1: Instalación Automática (Recomendada)

1. **Subir archivos al servidor:**
   ```bash
   scp ipv4-calculator-*.tar.gz usuario@servidor:/tmp/
   scp install-server.sh usuario@servidor:/tmp/
   ```

2. **En el servidor, ejecutar:**
   ```bash
   cd /tmp
   tar -xzf ipv4-calculator-*.tar.gz -C /var/www/ipv4-calculator
   sudo bash install-server.sh
   ```

3. **Acceder a la aplicación:**
   - `http://localhost` (desde el servidor)
   - `http://IP_DEL_SERVIDOR` (desde otra máquina)

### Opción 2: Instalación Manual

Ver documentación completa en **[DEPLOYMENT.md](./DEPLOYMENT.md)**

## 📚 Estructura del Proyecto

```
ipv4-calculator/
├── src/
│   └── app/
│       ├── page.tsx          # Calculadora principal
│       ├── layout.tsx         # Layout de la aplicación
│       └── globals.css        # Estilos globales
├── public/                    # Archivos estáticos
├── .next/                     # Build de producción (generado)
├── package.json               # Dependencias
├── next.config.ts             # Configuración de Next.js
├── DEPLOYMENT.md              # Guía completa de despliegue
├── create-package.sh          # Script para empaquetar (Linux/Mac)
├── create-package.bat         # Script para empaquetar (Windows)
└── install-server.sh          # Script de instalación automática
```

## 🛠️ Tecnologías

- **Next.js 15.5** - Framework React
- **React 19** - Librería UI
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Estilos y diseño

## 📖 Ejemplos de Uso

### Ejemplo 1: Red Clase C
- **IP:** `192.168.1.10`
- **Máscara:** `255.255.255.0`
- **Resultado:**
  - Red: `192.168.1.0`
  - Broadcast: `192.168.1.255`
  - Hosts útiles: `254`
  - Rango: `192.168.1.1 - 192.168.1.254`
  - Clase: `C`
  - Tipo: `Privada`

### Ejemplo 2: Subred /28
- **IP:** `10.0.0.50`
- **Máscara:** `255.255.255.240`
- **Resultado:**
  - Red: `10.0.0.48`
  - Broadcast: `10.0.0.63`
  - Hosts útiles: `14`
  - Rango: `10.0.0.49 - 10.0.0.62`
  - Clase: `A`
  - Tipo: `Privada`

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm start            # Ejecutar build de producción
npm run lint         # Verificar código

# Despliegue
./create-package.sh  # Crear paquete para servidor
```

## 📝 Notas

- La aplicación valida automáticamente el formato de IP y máscara
- Solo acepta máscaras en formato decimal (X.X.X.X), no CIDR
- Funciona en puerto 80 cuando se despliega en el servidor
- Compatible con modo claro y oscuro
- Diseño responsive (móvil, tablet, desktop)

## 👥 Autor

Desarrollado para el curso **Redes de Datos 1 - 246827**

## 📅 Vencimiento

**5 de octubre de 2025 a las 23:59**

---

Para más información sobre despliegue, consulta [DEPLOYMENT.md](./DEPLOYMENT.md)
