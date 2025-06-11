// Sistema de simulação de Boids usando PixiJS

import * as PIXI from 'pixi.js';
import { Boid } from './Boid';
import { SimulationConfig, DEFAULT_CONFIG } from './boids';

export class BoidsSimulation {
  private app: PIXI.Application;
  private boids: Boid[] = [];
  private config: SimulationConfig;
  private container: PIXI.Container;
  private isRunning: boolean = false;

  constructor(canvas: HTMLCanvasElement, config: Partial<SimulationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Inicializar aplicação PixiJS
    this.app = new PIXI.Application();
    this.container = new PIXI.Container();
    
    this.initializePixi(canvas);
    this.createBoids();
  }

  private async initializePixi(canvas: HTMLCanvasElement): Promise<void> {
    await this.app.init({
      canvas,
      width: this.config.canvasWidth,
      height: this.config.canvasHeight,
      backgroundColor: 0x1a1a1a,
      antialias: true,
    });

    this.app.stage.addChild(this.container);
  }

  private createBoids(): void {
    this.boids = [];
    this.container.removeChildren();

    for (let i = 0; i < this.config.boidCount; i++) {
      const x = Math.random() * this.config.canvasWidth;
      const y = Math.random() * this.config.canvasHeight;
      const boid = new Boid(x, y, this.config);
      
      this.boids.push(boid);
      
      // Criar gráfico do triângulo
      const triangle = this.createTriangleGraphic();
      triangle.position.set(x, y);
      this.container.addChild(triangle);
    }
  }

  private createTriangleGraphic(): PIXI.Graphics {
    const triangle = new PIXI.Graphics();
    
    // Desenhar triângulo apontando para cima usando nova API do PixiJS v8
    triangle
      .fill(0x00ff88)
      .stroke({ color: 0x00aa55, width: 1 })
      .moveTo(0, -8)  // Ponta superior
      .lineTo(-6, 6)  // Canto inferior esquerdo
      .lineTo(6, 6)   // Canto inferior direito
      .lineTo(0, -8); // Fechar o triângulo
    
    return triangle;
  }

  // Iniciar simulação
  start(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.app.ticker.add(this.update.bind(this));
    }
  }

  // Parar simulação
  stop(): void {
    if (this.isRunning) {
      this.isRunning = false;
      this.app.ticker.remove(this.update.bind(this));
    }
  }

  // Loop principal de atualização
  private update(): void {
    // Atualizar cada boid
    for (let i = 0; i < this.boids.length; i++) {
      const boid = this.boids[i];
      const graphic = this.container.children[i] as PIXI.Graphics;
      
      // Aplicar comportamentos de flock
      boid.flock(this.boids);
      
      // Atualizar posição
      boid.update(this.config.canvasWidth, this.config.canvasHeight);
      
      // Atualizar gráfico
      graphic.position.set(boid.position.x, boid.position.y);
      graphic.rotation = boid.getRotation() + Math.PI / 2; // Ajustar rotação
    }
  }

  // Atualizar configuração
  updateConfig(newConfig: Partial<SimulationConfig>): void {
    const oldBoidCount = this.config.boidCount;
    this.config = { ...this.config, ...newConfig };
    
    // Atualizar configuração dos boids existentes
    for (const boid of this.boids) {
      Object.assign(boid['config'], this.config);
    }
    
    // Se o número de boids mudou, recriar
    if (newConfig.boidCount !== undefined && newConfig.boidCount !== oldBoidCount) {
      this.createBoids();
    }
    
    // Redimensionar canvas se necessário
    if (newConfig.canvasWidth || newConfig.canvasHeight) {
      this.app.renderer.resize(this.config.canvasWidth, this.config.canvasHeight);
    }
  }

  // Obter configuração atual
  getConfig(): SimulationConfig {
    return { ...this.config };
  }

  // Destruir simulação
  destroy(): void {
    this.stop();
    this.app.destroy(true);
  }

  // Obter aplicação PixiJS (para debug)
  getApp(): PIXI.Application {
    return this.app;
  }
}

