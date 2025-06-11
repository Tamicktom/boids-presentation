// Classe Boid - implementa os comportamentos de enxame

import { Vector2 } from './vector';
import { BoidConfig } from './boids';

export class Boid {
  public position: Vector2;
  public velocity: Vector2;
  public acceleration: Vector2;
  public size: number;

  constructor(x: number, y: number, private config: BoidConfig) {
    this.position = new Vector2(x, y);
    this.velocity = Vector2.random().setMag(Math.random() * 2 + 1);
    this.acceleration = new Vector2();
    this.size = 8;
  }

  // Atualizar posição e velocidade
  update(canvasWidth: number, canvasHeight: number): void {
    // Atualizar velocidade com aceleração
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.config.maxSpeed);

    // Atualizar posição
    this.position.add(this.velocity);

    // Resetar aceleração
    this.acceleration.mult(0);

    // Wrap around nas bordas
    this.wrapAround(canvasWidth, canvasHeight);
  }

  // Aplicar força
  applyForce(force: Vector2): void {
    this.acceleration.add(force);
  }

  // Comportamento de separação - evitar outros boids
  separate(boids: Boid[]): Vector2 {
    const steer = new Vector2();
    let count = 0;

    for (const other of boids) {
      const distance = this.position.dist(other.position);

      if (distance > 0 && distance < this.config.separationRadius) {
        // Calcular vetor apontando para longe do vizinho
        const diff = Vector2.sub(this.position, other.position);
        diff.normalize();
        diff.div(distance); // Peso pela distância
        steer.add(diff);
        count++;
      }
    }

    if (count > 0) {
      steer.div(count);
      steer.normalize();
      steer.mult(this.config.maxSpeed);
      steer.sub(this.velocity);
      steer.limit(this.config.maxForce);
      steer.mult(this.config.separationForce);
    }

    return steer;
  }

  // Comportamento de alinhamento - alinhar com vizinhos
  align(boids: Boid[]): Vector2 {
    const sum = new Vector2();
    let count = 0;

    for (const other of boids) {
      const distance = this.position.dist(other.position);

      if (distance > 0 && distance < this.config.alignmentRadius) {
        sum.add(other.velocity);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.config.maxSpeed);

      const steer = Vector2.sub(sum, this.velocity);
      steer.limit(this.config.maxForce);
      steer.mult(this.config.alignmentForce);
      return steer;
    }

    return new Vector2();
  }

  // Comportamento de coesão - mover em direção ao centro do grupo
  cohesion(boids: Boid[]): Vector2 {
    const sum = new Vector2();
    let count = 0;

    for (const other of boids) {
      const distance = this.position.dist(other.position);

      if (distance > 0 && distance < this.config.cohesionRadius) {
        sum.add(other.position);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      return this.seek(sum);
    }

    return new Vector2();
  }

  // Buscar uma posição específica
  private seek(target: Vector2): Vector2 {
    const desired = Vector2.sub(target, this.position);
    desired.normalize();
    desired.mult(this.config.maxSpeed);

    const steer = Vector2.sub(desired, this.velocity);
    steer.limit(this.config.maxForce);
    steer.mult(this.config.cohesionForce);
    return steer;
  }

  // Aplicar comportamentos de flock
  flock(boids: Boid[]): void {
    const sep = this.separate(boids);
    const ali = this.align(boids);
    const coh = this.cohesion(boids);

    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }

  // Wrap around nas bordas da tela
  private wrapAround(width: number, height: number): void {
    if (this.position.x < 0) this.position.x = width;
    if (this.position.x > width) this.position.x = 0;
    if (this.position.y < 0) this.position.y = height;
    if (this.position.y > height) this.position.y = 0;
  }

  // Obter ângulo de rotação baseado na velocidade
  getRotation(): number {
    return this.velocity.heading();
  }
}

