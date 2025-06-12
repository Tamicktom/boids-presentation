"use client";
//* Libraries imports
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import colors from 'tailwindcss/colors';

interface DemoBoid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

interface BoidDemoProps {
  demoType: 'none' | 'alignment' | 'separation' | 'cohesion' | 'all';
}

function BoidDemo({
  demoType,
}: BoidDemoProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const boidsRef = React.useRef<DemoBoid[]>([]);
  const animationRef = React.useRef<number>(null);
  const [showVisionCircles, setShowVisionCircles] = React.useState(false);

  // const width = wrapperRef.current ? wrapperRef.current.clientWidth : 300;
  // const height = wrapperRef.current ? wrapperRef.current.clientHeight : 200;

  const { width, height } = React.useMemo(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return { width: 300, height: 200 };
    return {
      width: wrapper.clientWidth,
      height: wrapper.clientHeight
    };
  }, [wrapperRef.current]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const boidGenerator = (amount: number) => {
      const possibleColors = [
        colors.rose[300],
        colors.pink[300],
        colors.violet[300],
        colors.indigo[300],
        colors.blue[300],
        colors.cyan[300],
        colors.teal[300],
        colors.emerald[300],
        colors.lime[300],
        colors.yellow[300],
        colors.amber[300],
      ];

      const boids: DemoBoid[] = [];
      for (let i = 0; i < amount; i++) {
        const color = possibleColors[Math.floor(Math.random() * possibleColors.length)];
        boids.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          color
        });
      }
      return boids;
    }

    // Criar boids baseado no tipo de demo
    const boids: DemoBoid[] = [];

    if (demoType === 'none') {
      // Um boid sem regras
      boids.push(
        ...boidGenerator(1)
      );
    } else {
      boids.push(
        ...boidGenerator(8)
      );
    }

    boidsRef.current = boids;

    const drawTriangle = (x: number, y: number, angle: number, color: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      ctx.fillStyle = color;
      ctx.strokeStyle = colors.neutral[600];
      ctx.lineWidth = 1;

      const boidSize = 32;

      ctx.beginPath();
      ctx.moveTo(boidSize / 2, 0);
      ctx.lineTo(-boidSize / 2, -boidSize / 4);
      ctx.lineTo(-boidSize / 2, boidSize / 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    };

    const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string, width: number = 2) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    // const drawCircle = (x: number, y: number, radius: number, color: string, filled: boolean = false) => {
    //   ctx.strokeStyle = color;
    //   ctx.lineWidth = 2;
    //   ctx.beginPath();
    //   ctx.arc(x, y, radius, 0, Math.PI * 2);
    //   if (filled) {
    //     ctx.fillStyle = color;
    //     ctx.fill();
    //   } else {
    //     ctx.stroke();
    //   }
    // };

    const drawVisionCircle = (x: number, y: number, radius: number) => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const drawPoint = (x: number, y: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    };

    // Algoritmos simplificados
    const distance = (x1: number, y1: number, x2: number, y2: number) => {
      return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    };

    const normalize = (x: number, y: number) => {
      const length = Math.sqrt(x * x + y * y);
      return length > 0 ? { x: x / length, y: y / length } : { x: 0, y: 0 };
    };

    // Definir raios de visão baseado no tipo de demo
    const getVisionRadius = (demoType: string) => {
      switch (demoType) {
        case 'none': return 60;
        case 'alignment': return 80;
        case 'separation': return 50;
        case 'cohesion': return 100;
        case 'all': return 80;
        default: return 80;
      }
    };

    const visionRadius = getVisionRadius(demoType);

    const animate = () => {
      // Limpar canvas
      ctx.fillStyle = colors.neutral[100];
      ctx.fillRect(0, 0, width, height);

      // desenha um grid de linhas horizontais e verticais
      ctx.strokeStyle = colors.neutral[300];
      ctx.lineWidth = 0.5;
      const squareSize = 25;
      for (let x = 0; x < width; x += squareSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += squareSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const boids = boidsRef.current;

      // Desenhar círculos de visão primeiro (se ativado)
      if (showVisionCircles) {
        boids.forEach((boid) => {
          drawVisionCircle(boid.x, boid.y, visionRadius);
        });
      }

      // Aplicar algoritmos baseado no tipo
      boids.forEach((boid, index) => {
        let steerX = 0;
        let steerY = 0;

        if (demoType === 'alignment') {
          // Alinhamento: média das velocidades dos vizinhos
          let avgVx = 0, avgVy = 0, count = 0;
          boids.forEach((other, otherIndex) => {
            if (index !== otherIndex && distance(boid.x, boid.y, other.x, other.y) < visionRadius) {
              avgVx += other.vx;
              avgVy += other.vy;
              count++;
            }
          });
          if (count > 0) {
            avgVx /= count;
            avgVy /= count;
            const normalized = normalize(avgVx, avgVy);
            steerX = normalized.x * 0.02;
            steerY = normalized.y * 0.02;
          }
        } else if (demoType === 'separation') {
          // Separação: afastar de vizinhos próximos
          boids.forEach((other, otherIndex) => {
            if (index !== otherIndex) {
              const d = distance(boid.x, boid.y, other.x, other.y);
              if (d < visionRadius && d > 0) {
                const diffX = boid.x - other.x;
                const diffY = boid.y - other.y;
                const normalized = normalize(diffX, diffY);
                steerX += normalized.x * (visionRadius - d) * 0.001;
                steerY += normalized.y * (visionRadius - d) * 0.001;
              }
            }
          });
        } else if (demoType === 'cohesion') {
          // Coesão: mover em direção ao centro dos vizinhos
          let avgX = 0, avgY = 0, count = 0;
          boids.forEach((other, otherIndex) => {
            if (index !== otherIndex && distance(boid.x, boid.y, other.x, other.y) < visionRadius) {
              avgX += other.x;
              avgY += other.y;
              count++;
            }
          });
          if (count > 0) {
            avgX /= count;
            avgY /= count;
            const diffX = avgX - boid.x;
            const diffY = avgY - boid.y;
            const normalized = normalize(diffX, diffY);
            steerX = normalized.x * 0.01;
            steerY = normalized.y * 0.01;
          }
        } else if (demoType === 'all') {
          // Todas as regras combinadas (versão simplificada)
          // Separação
          boids.forEach((other, otherIndex) => {
            if (index !== otherIndex) {
              const d = distance(boid.x, boid.y, other.x, other.y);
              if (d < 30 && d > 0) {
                const diffX = boid.x - other.x;
                const diffY = boid.y - other.y;
                const normalized = normalize(diffX, diffY);
                steerX += normalized.x * 0.02;
                steerY += normalized.y * 0.02;
              }
            }
          });

          // Alinhamento
          let avgVx = 0, avgVy = 0, count = 0;
          boids.forEach((other, otherIndex) => {
            if (index !== otherIndex && distance(boid.x, boid.y, other.x, other.y) < 60) {
              avgVx += other.vx;
              avgVy += other.vy;
              count++;
            }
          });
          if (count > 0) {
            avgVx /= count;
            avgVy /= count;
            const normalized = normalize(avgVx, avgVy);
            steerX += normalized.x * 0.01;
            steerY += normalized.y * 0.01;
          }

          // Coesão
          let avgX = 0, avgY = 0;
          count = 0;
          boids.forEach((other, otherIndex) => {
            if (index !== otherIndex && distance(boid.x, boid.y, other.x, other.y) < visionRadius) {
              avgX += other.x;
              avgY += other.y;
              count++;
            }
          });
          if (count > 0) {
            avgX /= count;
            avgY /= count;
            const diffX = avgX - boid.x;
            const diffY = avgY - boid.y;
            const normalized = normalize(diffX, diffY);
            steerX += normalized.x * 0.005;
            steerY += normalized.y * 0.005;
          }
        }

        // Aplicar steering
        boid.vx += steerX;
        boid.vy += steerY;

        // Limitar velocidade
        const speed = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy);
        const maxSpeed = demoType === 'none' ? 1.5 : 1.0;
        if (speed > maxSpeed) {
          boid.vx = (boid.vx / speed) * maxSpeed;
          boid.vy = (boid.vy / speed) * maxSpeed;
        }

        // Atualizar posição
        boid.x += boid.vx;
        boid.y += boid.vy;

        // Wrap around
        if (boid.x < 0) boid.x = width;
        if (boid.x > width) boid.x = 0;
        if (boid.y < 0) boid.y = height;
        if (boid.y > height) boid.y = 0;

        // Desenhar boid
        const angle = Math.atan2(boid.vy, boid.vx);
        drawTriangle(boid.x, boid.y, angle, boid.color);

        // Desenhar visualizações específicas
        if (demoType === 'alignment') {
          // Linha mostrando direção
          const lineLength = 25;
          drawLine(
            boid.x,
            boid.y,
            boid.x + Math.cos(angle) * lineLength,
            boid.y + Math.sin(angle) * lineLength,
            colors.lime[500],
            2
          );
        } else if (demoType === 'separation') {
          // Linha mostrando força de separação
          if (steerX !== 0 || steerY !== 0) {
            const separationAngle = Math.atan2(steerY, steerX);
            const lineLength = 30;
            drawLine(
              boid.x,
              boid.y,
              boid.x + Math.cos(separationAngle) * lineLength,
              boid.y + Math.sin(separationAngle) * lineLength,
              '#ff0000',
              3
            );
          }
        } else if (demoType === 'cohesion') {
          // Mostrar centro de coesão
          let avgX = 0, avgY = 0, count = 0;
          boids.forEach((other, otherIndex) => {
            if (index !== otherIndex && distance(boid.x, boid.y, other.x, other.y) < visionRadius) {
              avgX += other.x;
              avgY += other.y;
              count++;
            }
          });
          if (count > 0) {
            avgX /= count;
            avgY /= count;
            // Desenhar ponto de coesão
            drawPoint(avgX, avgY, '#ffff00');
            // Linha para o centro
            drawLine(boid.x, boid.y, avgX, avgY, '#00ffff', 1);
          }
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [demoType, width, height, showVisionCircles]);

  return (
    <div
      ref={wrapperRef}
      className="relative size-full"
    >
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button
          onClick={() => setShowVisionCircles(!showVisionCircles)}
          className={`p-2 rounded-lg transition-colors ${showVisionCircles
            ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          title={showVisionCircles ? 'Ocultar zona de visão' : 'Mostrar zona de visão'}
        >
          {showVisionCircles ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className="rounded border-2 border-gray-200"
        width={width}
        height={height}
      />
    </div>
  );
};

export default BoidDemo;

