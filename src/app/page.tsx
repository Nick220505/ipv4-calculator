"use client";

import { useState } from "react";

interface CalculationResult {
  networkIP: string;
  broadcastIP: string;
  usableHosts: number;
  usableRange: string;
  ipClass: string;
  isPrivate: boolean;
  networkBinary: string;
  hostBinary: string;
  fullBinary: string;
  subnetBits: number;
}

export default function Home() {
  const [ip, setIp] = useState("");
  const [mask, setMask] = useState("");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState("");

  const ipToNumber = (ip: string): number => {
    const parts = ip.split(".").map(Number);
    return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
  };

  const numberToIp = (num: number): string => {
    return [
      (num >>> 24) & 255,
      (num >>> 16) & 255,
      (num >>> 8) & 255,
      num & 255,
    ].join(".");
  };

  const ipToBinary = (ip: string): string => {
    return ip
      .split(".")
      .map((octet) => parseInt(octet).toString(2).padStart(8, "0"))
      .join(".");
  };

  const validateIP = (ip: string): boolean => {
    const parts = ip.split(".");
    if (parts.length !== 4) return false;
    return parts.every((part) => {
      const num = parseInt(part);
      return !isNaN(num) && num >= 0 && num <= 255;
    });
  };

  const validateMask = (mask: string): boolean => {
    if (!validateIP(mask)) return false;

    const binary = mask
      .split(".")
      .map((octet) => parseInt(octet).toString(2).padStart(8, "0"))
      .join("");

    // Check if mask is contiguous (all 1s followed by all 0s)
    const match = binary.match(/^(1*)(0*)$/);
    if (!match) return false;

    return true;
  };

  const getIPClass = (firstOctet: number): string => {
    if (firstOctet >= 1 && firstOctet <= 126) return "A";
    if (firstOctet >= 128 && firstOctet <= 191) return "B";
    if (firstOctet >= 192 && firstOctet <= 223) return "C";
    if (firstOctet >= 224 && firstOctet <= 239) return "D";
    if (firstOctet >= 240 && firstOctet <= 255) return "E";
    return "Invalid";
  };

  const isPrivateIP = (ip: string): boolean => {
    const parts = ip.split(".").map(Number);
    const first = parts[0];
    const second = parts[1];

    // Class A: 10.0.0.0 - 10.255.255.255
    if (first === 10) return true;

    // Class B: 172.16.0.0 - 172.31.255.255
    if (first === 172 && second >= 16 && second <= 31) return true;

    // Class C: 192.168.0.0 - 192.168.255.255
    if (first === 192 && second === 168) return true;

    return false;
  };

  const getSubnetBits = (mask: string): number => {
    const binary = mask
      .split(".")
      .map((octet) => parseInt(octet).toString(2).padStart(8, "0"))
      .join("");
    return binary.split("1").length - 1;
  };

  const calculate = () => {
    setError("");
    setResult(null);

    if (!validateIP(ip)) {
      setError("Dirección IP inválida. Formato: X.X.X.X (0-255)");
      return;
    }

    if (!validateMask(mask)) {
      setError(
        "Máscara de subred inválida. Debe ser una máscara válida en formato X.X.X.X"
      );
      return;
    }

    const ipNum = ipToNumber(ip);
    const maskNum = ipToNumber(mask);

    // Calculate network IP
    const networkNum = ipNum & maskNum;
    const networkIP = numberToIp(networkNum);

    // Calculate broadcast IP
    const hostBits = ~maskNum;
    const broadcastNum = networkNum | hostBits;
    const broadcastIP = numberToIp(broadcastNum);

    // Calculate usable hosts
    const totalHosts = Math.pow(2, 32 - getSubnetBits(mask));
    const usableHosts = totalHosts > 2 ? totalHosts - 2 : 0;

    // Calculate usable range
    const firstUsable = numberToIp(networkNum + 1);
    const lastUsable = numberToIp(broadcastNum - 1);
    const usableRange =
      usableHosts > 0 ? `${firstUsable} - ${lastUsable}` : "N/A";

    // Get IP class
    const firstOctet = parseInt(ip.split(".")[0]);
    const ipClass = getIPClass(firstOctet);

    // Check if private
    const isPrivate = isPrivateIP(ip);

    // Binary representation
    const fullBinary = ipToBinary(ip);
    const maskBinary = ipToBinary(mask);
    const subnetBits = getSubnetBits(mask);

    // Split binary into network and host portions
    const binaryNoDots = fullBinary.replace(/\./g, "");
    const networkBinary = binaryNoDots.substring(0, subnetBits);
    const hostBinary = binaryNoDots.substring(subnetBits);

    setResult({
      networkIP,
      broadcastIP,
      usableHosts,
      usableRange,
      ipClass,
      isPrivate,
      networkBinary,
      hostBinary,
      fullBinary: binaryNoDots,
      subnetBits,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Calculadora IPv4
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Redes de Datos 1 - 246827
            </p>
          </div>

          {/* Input Section */}
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Dirección IP (formato decimal)
              </label>
              <input
                type="text"
                placeholder="192.168.1.10"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Máscara de subred (formato decimal)
              </label>
              <input
                type="text"
                placeholder="255.255.255.0"
                value={mask}
                onChange={(e) => setMask(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 transition-colors"
              />
            </div>

            <button
              onClick={calculate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Calcular
            </button>

            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 border-2 border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Results Section */}
          {result && (
            <div className="space-y-6 border-t-2 border-gray-200 dark:border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Resultados
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResultCard label="IP de Red" value={result.networkIP} />
                <ResultCard
                  label="IP de Broadcast"
                  value={result.broadcastIP}
                />
                <ResultCard
                  label="Hosts Útiles"
                  value={result.usableHosts.toLocaleString()}
                />
                <ResultCard label="Clase de IP" value={result.ipClass} />
              </div>

              <ResultCard
                label="Rango de IPs Útiles"
                value={result.usableRange}
                fullWidth
              />

              <ResultCard
                label="Tipo de IP"
                value={result.isPrivate ? "Privada" : "Pública"}
                fullWidth
                highlight={result.isPrivate ? "private" : "public"}
              />

              {/* Binary Representation */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6 shadow-inner">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Representación Binaria
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <div className="mb-2 text-gray-600 dark:text-gray-300 text-center">
                    BINARIO
                  </div>
                  <div className="flex justify-center items-center flex-wrap gap-0">
                    <span className="bg-red-500 text-white px-2 py-1 rounded-l">
                      {result.networkBinary}
                    </span>
                    <span className="bg-green-500 text-white px-2 py-1 rounded-r">
                      {result.hostBinary}
                    </span>
                  </div>
                  <div className="flex justify-center items-center gap-8 mt-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                        red
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                        subred
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                        host
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
                    <div>Bits de red/subred: {result.subnetBits}</div>
                    <div>Bits de host: {32 - result.subnetBits}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 dark:text-gray-400 text-sm">
          <p>Calculadora IPv4 - Vencimiento: 5 de octubre a 23:59</p>
        </div>
      </div>
    </div>
  );
}

interface ResultCardProps {
  label: string;
  value: string;
  fullWidth?: boolean;
  highlight?: "private" | "public";
}

function ResultCard({ label, value, fullWidth, highlight }: ResultCardProps) {
  const getHighlightColor = () => {
    if (highlight === "private")
      return "bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-600";
    if (highlight === "public")
      return "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400 dark:border-yellow-600";
    return "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600";
  };

  return (
    <div
      className={`${
        fullWidth ? "col-span-full" : ""
      } ${getHighlightColor()} border-2 rounded-lg p-4 shadow-sm`}
    >
      <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
        {label}
      </div>
      <div className="text-xl font-bold text-gray-800 dark:text-white break-all">
        {value}
      </div>
    </div>
  );
}
