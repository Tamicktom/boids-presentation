// Componente de painel de controles para a simulação de Boids

import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Slider } from '@/components/ui/slider.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet.jsx';
import { Settings, Play, Pause, RotateCcw } from 'lucide-react';
import { SimulationConfig } from './boids';

interface ControlPanelProps {
  config: SimulationConfig;
  isRunning: boolean;
  onConfigChange: (config: Partial<SimulationConfig>) => void;
  onToggleSimulation: () => void;
  onReset: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  isRunning,
  onConfigChange,
  onToggleSimulation,
  onReset,
}) => {
  const handleSliderChange = (key: keyof SimulationConfig) => (value: number[]) => {
    onConfigChange({ [key]: value[0] });
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="bg-white/90 backdrop-blur-sm">
            <Settings className="h-4 w-4" />
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
                    onClick={onToggleSimulation}
                    variant={isRunning ? "destructive" : "default"}
                    size="sm"
                    className="flex-1"
                  >
                    {isRunning ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Iniciar
                      </>
                    )}
                  </Button>
                  <Button onClick={onReset} variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
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
                  <Label htmlFor="boidCount">Quantidade de Boids: {config.boidCount}</Label>
                  <Slider
                    id="boidCount"
                    min={10}
                    max={300}
                    step={10}
                    value={[config.boidCount]}
                    onValueChange={handleSliderChange('boidCount')}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxSpeed">Velocidade Máxima: {config.maxSpeed.toFixed(1)}</Label>
                  <Slider
                    id="maxSpeed"
                    min={0.5}
                    max={5}
                    step={0.1}
                    value={[config.maxSpeed]}
                    onValueChange={handleSliderChange('maxSpeed')}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxForce">Força Máxima: {config.maxForce.toFixed(3)}</Label>
                  <Slider
                    id="maxForce"
                    min={0.01}
                    max={0.1}
                    step={0.005}
                    value={[config.maxForce]}
                    onValueChange={handleSliderChange('maxForce')}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Raios de Influência */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Raios de Influência</CardTitle>
                <CardDescription className="text-xs">
                  Distâncias em que os comportamentos são aplicados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="separationRadius">Separação: {config.separationRadius}px</Label>
                  <Slider
                    id="separationRadius"
                    min={10}
                    max={100}
                    step={5}
                    value={[config.separationRadius]}
                    onValueChange={handleSliderChange('separationRadius')}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alignmentRadius">Alinhamento: {config.alignmentRadius}px</Label>
                  <Slider
                    id="alignmentRadius"
                    min={20}
                    max={150}
                    step={5}
                    value={[config.alignmentRadius]}
                    onValueChange={handleSliderChange('alignmentRadius')}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cohesionRadius">Coesão: {config.cohesionRadius}px</Label>
                  <Slider
                    id="cohesionRadius"
                    min={20}
                    max={150}
                    step={5}
                    value={[config.cohesionRadius]}
                    onValueChange={handleSliderChange('cohesionRadius')}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Forças dos Comportamentos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Intensidade dos Comportamentos</CardTitle>
                <CardDescription className="text-xs">
                  Ajuste a força de cada comportamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="separationForce">Força de Separação: {config.separationForce.toFixed(1)}</Label>
                  <Slider
                    id="separationForce"
                    min={0}
                    max={3}
                    step={0.1}
                    value={[config.separationForce]}
                    onValueChange={handleSliderChange('separationForce')}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alignmentForce">Força de Alinhamento: {config.alignmentForce.toFixed(1)}</Label>
                  <Slider
                    id="alignmentForce"
                    min={0}
                    max={3}
                    step={0.1}
                    value={[config.alignmentForce]}
                    onValueChange={handleSliderChange('alignmentForce')}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cohesionForce">Força de Coesão: {config.cohesionForce.toFixed(1)}</Label>
                  <Slider
                    id="cohesionForce"
                    min={0}
                    max={3}
                    step={0.1}
                    value={[config.cohesionForce]}
                    onValueChange={handleSliderChange('cohesionForce')}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

