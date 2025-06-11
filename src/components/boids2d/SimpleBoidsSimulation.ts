// Versão simplificada da simulação para debug

import * as PIXI from 'pixi.js';

export class SimpleBoidsSimulation {
  private app: PIXI.Application;
  private container: PIXI.Container;

  constructor(canvas: HTMLCanvasElement) {
    this.app = new PIXI.Application();
    this.container = new PIXI.Container();
    
    this.initializePixi(canvas);
  }

  private async initializePixi(canvas: HTMLCanvasElement): Promise<void> {
    try {
      await this.app.init({
        canvas,
        width: 800,
        height: 600,
        backgroundColor: 0x1a1a1a,
        antialias: true,
      });

      // Aguardar um frame para garantir que tudo está inicializado
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      if (this.app.stage) {
        this.app.stage.addChild(this.container);
        
        // Criar alguns triângulos de teste
        this.createTestTriangles();
      } else {
        throw new Error('Stage do PixiJS não foi inicializado');
      }
    } catch (error) {
      console.error('Erro ao inicializar PixiJS:', error);
      throw error;
    }
  }

  private createTestTriangles(): void {
    for (let i = 0; i < 10; i++) {
      const triangle = new PIXI.Graphics();
      
      triangle
        .fill(0x00ff88)
        .stroke({ color: 0x00aa55, width: 1 })
        .moveTo(0, -8)
        .lineTo(-6, 6)
        .lineTo(6, 6)
        .lineTo(0, -8);
      
      triangle.position.set(
        Math.random() * 800,
        Math.random() * 600
      );
      
      this.container.addChild(triangle);
    }
  }

  destroy(): void {
    this.app.destroy(true);
  }
}

