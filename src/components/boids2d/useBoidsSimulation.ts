// Hook personalizado para gerenciar a simulação de Boids

import { useEffect, useRef, useState, useCallback } from 'react';
import { BoidsSimulation } from './BoidsSimulation';
import { SimulationConfig, DEFAULT_CONFIG } from './boids';

export const useBoidsSimulation = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const simulationRef = useRef<BoidsSimulation | null>(null);
  const [config, setConfig] = useState<SimulationConfig>(DEFAULT_CONFIG);
  const [isRunning, setIsRunning] = useState(false);

  // Inicializar simulação
  useEffect(() => {
    if (canvasRef.current && !simulationRef.current) {
      simulationRef.current = new BoidsSimulation(canvasRef.current, config);
    }

    return () => {
      if (simulationRef.current) {
        simulationRef.current.destroy();
        simulationRef.current = null;
      }
    };
  }, [canvasRef]);

  // Atualizar configuração
  const updateConfig = useCallback((newConfig: Partial<SimulationConfig>) => {
    setConfig(prev => {
      const updated = { ...prev, ...newConfig };
      if (simulationRef.current) {
        simulationRef.current.updateConfig(newConfig);
      }
      return updated;
    });
  }, []);

  // Alternar simulação
  const toggleSimulation = useCallback(() => {
    if (simulationRef.current) {
      if (isRunning) {
        simulationRef.current.stop();
      } else {
        simulationRef.current.start();
      }
      setIsRunning(!isRunning);
    }
  }, [isRunning]);

  // Resetar simulação
  const resetSimulation = useCallback(() => {
    if (simulationRef.current) {
      simulationRef.current.stop();
      simulationRef.current.destroy();
      simulationRef.current = null;
      setIsRunning(false);

      // Recriar simulação
      if (canvasRef.current) {
        simulationRef.current = new BoidsSimulation(canvasRef.current, config);
      }
    }
  }, [canvasRef, config]);

  // Iniciar automaticamente
  useEffect(() => {
    const timer = setTimeout(() => {
      if (simulationRef.current && !isRunning) {
        toggleSimulation();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [simulationRef?.current]);

  return {
    config,
    isRunning,
    updateConfig,
    toggleSimulation,
    resetSimulation,
  };
};

