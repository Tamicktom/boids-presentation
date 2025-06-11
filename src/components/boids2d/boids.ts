// Tipos e interfaces para a simulação de Boids

export interface Vector2D {
  x: number;
  y: number;
}

export interface BoidConfig {
  maxSpeed: number;
  maxForce: number;
  separationRadius: number;
  alignmentRadius: number;
  cohesionRadius: number;
  separationForce: number;
  alignmentForce: number;
  cohesionForce: number;
}

export interface SimulationConfig extends BoidConfig {
  boidCount: number;
  canvasWidth: number;
  canvasHeight: number;
}

export const DEFAULT_CONFIG: SimulationConfig = {
  boidCount: 100,
  maxSpeed: 2,
  maxForce: 0.03,
  separationRadius: 25,
  alignmentRadius: 50,
  cohesionRadius: 50,
  separationForce: 1.5,
  alignmentForce: 1.0,
  cohesionForce: 1.0,
  canvasWidth: 800,
  canvasHeight: 600,
};

