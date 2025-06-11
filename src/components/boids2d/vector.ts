// Utilitários matemáticos para vetores 2D

import { Vector2D } from './boids';

export class Vector2 implements Vector2D {
  constructor(public x: number = 0, public y: number = 0) { }

  // Criar um novo vetor
  static create(x: number, y: number): Vector2 {
    return new Vector2(x, y);
  }

  // Criar vetor aleatório
  static random(): Vector2 {
    return new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1);
  }

  // Clonar vetor
  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  // Adicionar vetor
  add(v: Vector2D): Vector2 {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  // Subtrair vetor
  sub(v: Vector2D): Vector2 {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  // Multiplicar por escalar
  mult(scalar: number): Vector2 {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  // Dividir por escalar
  div(scalar: number): Vector2 {
    if (scalar !== 0) {
      this.x /= scalar;
      this.y /= scalar;
    }
    return this;
  }

  // Calcular magnitude
  mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  // Calcular magnitude ao quadrado (mais eficiente)
  magSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  // Normalizar vetor
  normalize(): Vector2 {
    const m = this.mag();
    if (m !== 0) {
      this.div(m);
    }
    return this;
  }

  // Limitar magnitude
  limit(max: number): Vector2 {
    if (this.magSq() > max * max) {
      this.normalize();
      this.mult(max);
    }
    return this;
  }

  // Calcular distância para outro vetor
  dist(v: Vector2D): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Calcular distância ao quadrado (mais eficiente)
  distSq(v: Vector2D): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return dx * dx + dy * dy;
  }

  // Definir magnitude
  setMag(mag: number): Vector2 {
    this.normalize();
    this.mult(mag);
    return this;
  }

  // Calcular ângulo
  heading(): number {
    return Math.atan2(this.y, this.x);
  }

  // Definir valores
  set(x: number, y: number): Vector2 {
    this.x = x;
    this.y = y;
    return this;
  }

  // Métodos estáticos para operações sem modificar o vetor original
  static add(v1: Vector2D, v2: Vector2D): Vector2 {
    return new Vector2(v1.x + v2.x, v1.y + v2.y);
  }

  static sub(v1: Vector2D, v2: Vector2D): Vector2 {
    return new Vector2(v1.x - v2.x, v1.y - v2.y);
  }

  static mult(v: Vector2D, scalar: number): Vector2 {
    return new Vector2(v.x * scalar, v.y * scalar);
  }

  static dist(v1: Vector2D, v2: Vector2D): number {
    const dx = v1.x - v2.x;
    const dy = v1.y - v2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

