"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Settings, Play, Pause, RotateCcw, Eye, Target, Circle, GitBranch, ArrowRight } from 'lucide-react';

import { useWindowSize } from 'usehooks-ts'

// Interface para um Boid com propriedades de visualização
interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  isSelected: boolean;
}

// Configurações da simulação
interface SimulationConfig {
  boidCount: number;
  maxSpeed: number;
  separationRadius: number;
  alignmentRadius: number;
  cohesionRadius: number;
  separationForce: number;
  alignmentForce: number;
  cohesionForce: number;
}

// Configurações de visualização
interface VisualizationConfig {
  showDirection: boolean;
  showVisionZone: boolean;
  showCohesion: boolean;
  showSeparation: boolean;
}

const DEFAULT_CONFIG: SimulationConfig = {
  boidCount: 50,
  maxSpeed: 2,
  separationRadius: 30,
  alignmentRadius: 50,
  cohesionRadius: 50,
  separationForce: 1.5,
  alignmentForce: 1.0,
  cohesionForce: 1.0,
};

const DEFAULT_VISUALIZATION: VisualizationConfig = {
  showDirection: false,
  showVisionZone: false,
  showCohesion: false,
  showSeparation: false,
};

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(null);
  const boidsRef = useRef<Boid[]>([]);
  const selectedBoidRef = useRef<Boid | null>(null);
  const [config, setConfig] = useState<SimulationConfig>(DEFAULT_CONFIG);
  const [visualization, setVisualization] = useState<VisualizationConfig>(DEFAULT_VISUALIZATION);
  const [isRunning, setIsRunning] = useState(false);
  const windowSize = useWindowSize();

  // Função para calcular distância entre dois pontos
  const distance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  };

  // Algoritmo de separação com retorno de força para visualização
  const separate = (boid: Boid, boids: Boid[]) => {
    let steerX = 0;
    let steerY = 0;
    let count = 0;

    for (const other of boids) {
      const d = distance(boid.x, boid.y, other.x, other.y);
      if (d > 0 && d < config.separationRadius) {
        const diffX = boid.x - other.x;
        const diffY = boid.y - other.y;
        const length = Math.sqrt(diffX * diffX + diffY * diffY);
        if (length > 0) {
          steerX += (diffX / length) / d;
          steerY += (diffY / length) / d;
          count++;
        }
      }
    }

    if (count > 0) {
      steerX /= count;
      steerY /= count;
      const length = Math.sqrt(steerX * steerX + steerY * steerY);
      if (length > 0) {
        steerX = (steerX / length) * config.maxSpeed - boid.vx;
        steerY = (steerY / length) * config.maxSpeed - boid.vy;
        const steerLength = Math.sqrt(steerX * steerX + steerY * steerY);
        if (steerLength > 0.03) {
          steerX = (steerX / steerLength) * 0.03;
          steerY = (steerY / steerLength) * 0.03;
        }
        steerX *= config.separationForce;
        steerY *= config.separationForce;
      }
    }

    return { x: steerX, y: steerY };
  };

  // Algoritmo de alinhamento
  const align = (boid: Boid, boids: Boid[]) => {
    let sumX = 0;
    let sumY = 0;
    let count = 0;

    for (const other of boids) {
      const d = distance(boid.x, boid.y, other.x, other.y);
      if (d > 0 && d < config.alignmentRadius) {
        sumX += other.vx;
        sumY += other.vy;
        count++;
      }
    }

    if (count > 0) {
      sumX /= count;
      sumY /= count;
      const length = Math.sqrt(sumX * sumX + sumY * sumY);
      if (length > 0) {
        sumX = (sumX / length) * config.maxSpeed;
        sumY = (sumY / length) * config.maxSpeed;
        let steerX = sumX - boid.vx;
        let steerY = sumY - boid.vy;
        const steerLength = Math.sqrt(steerX * steerX + steerY * steerY);
        if (steerLength > 0.03) {
          steerX = (steerX / steerLength) * 0.03;
          steerY = (steerY / steerLength) * 0.03;
        }
        steerX *= config.alignmentForce;
        steerY *= config.alignmentForce;
        return { x: steerX, y: steerY };
      }
    }

    return { x: 0, y: 0 };
  };

  // Algoritmo de coesão com retorno de vizinhos para visualização
  const cohesion = (boid: Boid, boids: Boid[]) => {
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    const neighbors: Boid[] = [];

    for (const other of boids) {
      const d = distance(boid.x, boid.y, other.x, other.y);
      if (d > 0 && d < config.cohesionRadius) {
        sumX += other.x;
        sumY += other.y;
        count++;
        neighbors.push(other);
      }
    }

    let steerX = 0;
    let steerY = 0;

    if (count > 0) {
      sumX /= count;
      sumY /= count;
      const desiredX = sumX - boid.x;
      const desiredY = sumY - boid.y;
      const length = Math.sqrt(desiredX * desiredX + desiredY * desiredY);
      if (length > 0) {
        const normalizedX = (desiredX / length) * config.maxSpeed;
        const normalizedY = (desiredY / length) * config.maxSpeed;
        steerX = normalizedX - boid.vx;
        steerY = normalizedY - boid.vy;
        const steerLength = Math.sqrt(steerX * steerX + steerY * steerY);
        if (steerLength > 0.03) {
          steerX = (steerX / steerLength) * 0.03;
          steerY = (steerY / steerLength) * 0.03;
        }
        steerX *= config.cohesionForce;
        steerY *= config.cohesionForce;
      }
    }

    return { force: { x: steerX, y: steerY }, neighbors };
  };

  // Criar boids
  const createBoids = (count: number) => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    const boids: Boid[] = [];

    for (let i = 0; i < count; i++) {
      boids.push({
        x: Math.random() * 700 + 50,
        y: Math.random() * 500 + 50,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        color: colors[i % colors.length],
        isSelected: false
      });
    }

    return boids;
  };

  // Selecionar boid aleatório
  const selectRandomBoid = () => {
    const boids = boidsRef.current;
    if (boids.length === 0) return;

    // Desselecionar todos os boids
    boids.forEach(boid => boid.isSelected = false);

    // Selecionar um aleatório
    const randomIndex = Math.floor(Math.random() * boids.length);
    boids[randomIndex].isSelected = true;
    selectedBoidRef.current = boids[randomIndex];
  };

  // Desenhar visualizações do boid selecionado
  const drawVisualizations = (ctx: CanvasRenderingContext2D, selectedBoid: Boid, boids: Boid[]) => {
    if (!selectedBoid) return;

    // Visualizar direção
    if (visualization.showDirection) {
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(selectedBoid.x, selectedBoid.y);
      ctx.lineTo(
        selectedBoid.x + selectedBoid.vx * 20,
        selectedBoid.y + selectedBoid.vy * 20
      );
      ctx.stroke();
    }

    // Visualizar zona de visão
    if (visualization.showVisionZone) {
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(selectedBoid.x, selectedBoid.y, Math.max(config.separationRadius, config.alignmentRadius, config.cohesionRadius), 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Visualizar coesão
    if (visualization.showCohesion) {
      const cohesionResult = cohesion(selectedBoid, boids);
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 1;
      cohesionResult.neighbors.forEach(neighbor => {
        ctx.beginPath();
        ctx.moveTo(selectedBoid.x, selectedBoid.y);
        ctx.lineTo(neighbor.x, neighbor.y);
        ctx.stroke();
      });
    }

    // Visualizar separação
    if (visualization.showSeparation) {
      const separationForce = separate(selectedBoid, boids);
      if (separationForce.x !== 0 || separationForce.y !== 0) {
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(selectedBoid.x, selectedBoid.y);
        ctx.lineTo(
          selectedBoid.x + separationForce.x * 100,
          selectedBoid.y + separationForce.y * 100
        );
        ctx.stroke();
      }
    }
  };

  useEffect(() => {
    boidsRef.current = createBoids(config.boidCount);
  }, [config.boidCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (boidsRef.current.length === 0) {
      boidsRef.current = createBoids(config.boidCount);
    }

    const drawTriangle = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, color: string, isSelected: boolean) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // Cor especial para boid selecionado
      ctx.fillStyle = isSelected ? '#0066ff' : (color === '#ffffff' ? '#ffffff' : color);
      ctx.strokeStyle = isSelected ? '#ffffff' : '#ffffff';
      ctx.lineWidth = isSelected ? 2 : 1;

      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.lineTo(-6, 6);
      ctx.lineTo(6, 6);
      ctx.closePath();

      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      // Limpar canvas
      const width = windowSize.width;
      const height = windowSize.height;
      ctx.fillStyle = 'white'; // Cor de fundo
      ctx.fillRect(0, 0, width, height);

      const boids = boidsRef.current;
      const selectedBoid = selectedBoidRef.current;

      // Aplicar algoritmos de Boids
      boids.forEach(boid => {
        const sep = separate(boid, boids);
        const ali = align(boid, boids);
        const coh = cohesion(boid, boids);

        // Aplicar forças
        boid.vx += sep.x + ali.x + coh.force.x;
        boid.vy += sep.y + ali.y + coh.force.y;

        // Limitar velocidade
        const speed = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy);
        if (speed > config.maxSpeed) {
          boid.vx = (boid.vx / speed) * config.maxSpeed;
          boid.vy = (boid.vy / speed) * config.maxSpeed;
        }

        // Atualizar posição
        boid.x += boid.vx;
        boid.y += boid.vy;

        // Wrap around nas bordas
        if (boid.x < 0) boid.x = width;
        if (boid.x > width) boid.x = 0;
        if (boid.y < 0) boid.y = height;
        if (boid.y > height) boid.y = 0;

        // Calcular ângulo baseado na velocidade
        const angle = Math.atan2(boid.vy, boid.vx) + Math.PI / 2;

        // Desenhar triângulo
        drawTriangle(ctx, boid.x, boid.y, angle, boid.color, boid.isSelected);
      });

      // Desenhar visualizações do boid selecionado
      if (selectedBoid && selectedBoid.isSelected) {
        drawVisualizations(ctx, selectedBoid, boids);
      }

      if (isRunning) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (isRunning) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, config, visualization, windowSize.width, windowSize.height]);

  const toggleSimulation = () => {
    setIsRunning(!isRunning);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    boidsRef.current = createBoids(config.boidCount);
    selectedBoidRef.current = null;
    setTimeout(() => setIsRunning(true), 100);
  };

  const updateConfig = (key: keyof SimulationConfig, value: number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateVisualization = (key: keyof VisualizationConfig, value: boolean) => {
    setVisualization(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className='bg-transparent'
        width={windowSize.width}
        height={windowSize.height}
      />

      {/* Painel de Controles */}
      <div className="absolute top-4 left-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-white/90 backdrop-blur-sm">
              <Settings className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Controles da Simulação</SheetTitle>
              <SheetDescription>
                Ajuste os parâmetros para modificar o comportamento dos boids
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 mt-6">
              {/* Controles de Simulação */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Simulação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      onClick={toggleSimulation}
                      variant={isRunning ? "destructive" : "default"}
                      size="sm"
                      className="flex-1"
                    >
                      {isRunning ? (
                        <>
                          <Pause className="size-4 mr-2" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play className="size-4 mr-2" />
                          Iniciar
                        </>
                      )}
                    </Button>
                    <Button onClick={resetSimulation} variant="outline" size="sm">
                      <RotateCcw className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Análise de Boid Individual */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center">
                    <Eye className="size-4 mr-2" />
                    Análise Individual
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Selecione um boid para análise detalhada
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={selectRandomBoid}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Target className="size-4 mr-2" />
                    Selecionar Boid Aleatório
                  </Button>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs flex items-center">
                        <ArrowRight className="size-3 mr-1" />
                        Mostrar Direção
                      </Label>
                      <Switch
                        checked={visualization.showDirection}
                        onCheckedChange={(checked) => updateVisualization('showDirection', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-xs flex items-center">
                        <Circle className="size-3 mr-1" />
                        Zona de Visão
                      </Label>
                      <Switch
                        checked={visualization.showVisionZone}
                        onCheckedChange={(checked) => updateVisualization('showVisionZone', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-xs flex items-center">
                        <GitBranch className="size-3 mr-1" />
                        Linhas de Coesão
                      </Label>
                      <Switch
                        checked={visualization.showCohesion}
                        onCheckedChange={(checked) => updateVisualization('showCohesion', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-xs flex items-center">
                        <ArrowRight className="size-3 mr-1 text-red-500" />
                        Força de Separação
                      </Label>
                      <Switch
                        checked={visualization.showSeparation}
                        onCheckedChange={(checked) => updateVisualization('showSeparation', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Parâmetros Gerais */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Parâmetros Gerais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Quantidade de Boids: {config.boidCount}</Label>
                    <Slider
                      min={10}
                      max={150}
                      step={10}
                      value={[config.boidCount]}
                      onValueChange={(value) => updateConfig('boidCount', value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Velocidade Máxima: {config.maxSpeed.toFixed(1)}</Label>
                    <Slider
                      min={0.5}
                      max={5}
                      step={0.1}
                      value={[config.maxSpeed]}
                      onValueChange={(value) => updateConfig('maxSpeed', value[0])}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Raios de Influência */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Raios de Influência</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Separação: {config.separationRadius}px</Label>
                    <Slider
                      min={10}
                      max={100}
                      step={5}
                      value={[config.separationRadius]}
                      onValueChange={(value) => updateConfig('separationRadius', value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Alinhamento: {config.alignmentRadius}px</Label>
                    <Slider
                      min={20}
                      max={150}
                      step={5}
                      value={[config.alignmentRadius]}
                      onValueChange={(value) => updateConfig('alignmentRadius', value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Coesão: {config.cohesionRadius}px</Label>
                    <Slider
                      min={20}
                      max={150}
                      step={5}
                      value={[config.cohesionRadius]}
                      onValueChange={(value) => updateConfig('cohesionRadius', value[0])}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Forças dos Comportamentos */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Intensidade dos Comportamentos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Força de Separação: {config.separationForce.toFixed(1)}</Label>
                    <Slider
                      min={0}
                      max={3}
                      step={0.1}
                      value={[config.separationForce]}
                      onValueChange={(value) => updateConfig('separationForce', value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Força de Alinhamento: {config.alignmentForce.toFixed(1)}</Label>
                    <Slider
                      min={0}
                      max={3}
                      step={0.1}
                      value={[config.alignmentForce]}
                      onValueChange={(value) => updateConfig('alignmentForce', value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Força de Coesão: {config.cohesionForce.toFixed(1)}</Label>
                    <Slider
                      min={0}
                      max={3}
                      step={0.1}
                      value={[config.cohesionForce]}
                      onValueChange={(value) => updateConfig('cohesionForce', value[0])}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export default App;

