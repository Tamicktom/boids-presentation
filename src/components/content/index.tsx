"use client";
//* Libraries imports
import dynamic from "next/dynamic";
import NextImage from "next/image";
import Link from "next/link";
import { InlineMath } from 'react-katex';

import 'katex/dist/katex.min.css';

//* Components imports
// import { RevealProvider } from "@/components/providers/reveal";

//* Utils imports
import { cn } from "@/lib/utils";

const RevealProvider = dynamic(() => import("@/components/providers/reveal"), {
  ssr: false,
});

const Boids = dynamic(() => import("@/components/boids2d"), {
  ssr: false,
});
const BoidDemo = dynamic(() => import("@/components/boids2d/boid-demo"), {
  ssr: false,
});

export function Content() {
  return (
    <div className="relative size-full overflow-hidden">
      <div className="absolute left-0 top-0 size-full z-0">
        <Boids />
      </div>
      <RevealProvider>
        <Section>
          {/* <div className="flex flex-col items-center justify-center relative"> */}
          {/* <div className="bg-gradient-to-br from-purple-500 via-rose-500 to-blue-500 size-[calc(100%_+_32px)] absolute -left-4 -top-4 rounded-2xl blur-2xl opacity-20" /> */}
          <div className="flex flex-col items-center justify-center z-10 bg-white/50 backdrop-blur-[4px] p-8 rounded-2xl border">
            <h1 className="text-7xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-32">
              Algoritmo Boids
            </h1>
            <p className="text-2xl text-muted-foreground">Simulação de Comportamento Coletivo</p>
          </div>
          {/* </div> */}
        </Section>

        <section>
          <Section>
            <div className="flex flex-col items-center justify-center z-10 bg-white/50 backdrop-blur-[4px] p-8 rounded-2xl border">
              <h2 className="text-7xl font-bold text-center">
                História
              </h2>
            </div>
          </Section>

          <Section>
            <div className="w-full grid grid-cols-6 items-center justify-center gap-4 bg-white/50 backdrop-blur-[4px] p-8 rounded-2xl border">
              <div className="flex flex-col justify-center w-full col-span-2 border rounded-2xl gap-2 p-4">
                <Link href="https://www.youtube.com/watch?v=rqP_c5zm89Q" target="_blank" rel="noopener noreferrer">
                  <NextImage
                    src="/craig-reynolds.png"
                    alt="Craig Reynolds - Criador do algoritmo Boids em 1986."
                    width={600}
                    height={600}
                    className="size-full object-cover rounded-2xl"
                  />
                </Link>

                <span>
                  Craig Reynolds em uma entrevista de 2015
                </span>
              </div>

              <div className="col-span-4 text-xl border rounded-2xl">
                <NextImage
                  src="/boids-paper.png"
                  alt="Flocks, Herds, and Schools: A Distributed Behavioral Model"
                  width={600}
                  height={600}
                  className="size-full object-cover rounded-2xl mt-2"
                />
              </div>
            </div>
          </Section>
        </section>

        <section>
          <Section>
            <div className="bg-white/50 backdrop-blur-[4px] p-8 rounded-2xl border">
              <h2 className="text-7xl font-bold text-center">Princípios Fundamentais</h2>
            </div>
          </Section>
          <Section>
            <div className="grid grid-cols-3 bg-white/50 backdrop-blur-[4px] p-8 rounded-2xl border">
              {/* Demo 1: Movimento Livre */}
              <div className="size-96 overflow-hidden rounded-2xl border col-span-1">
                <BoidDemo
                  demoType="none"
                />
              </div>
              <div className="col-span-2 flex flex-col justify-start gap-4 pl-4">
                <h3 className="text-3xl font-bold">Movimento</h3>
                <p className="w-full text-left text-lg">
                  Um boid sem nenhuma regra aplicada se move em linha reta com velocidade constante. <br />
                  Este é o comportamento base antes de aplicarmos qualquer algoritmo de inteligência de enxame.
                </p>
              </div>
            </div>
          </Section>
          <Section>
            <div className="grid grid-cols-3 bg-white/50 backdrop-blur-[4px] p-8 rounded-2xl border">
              {/* Demo 2: Alinhamento */}
              <div className="size-96 overflow-hidden rounded-2xl border col-span-1">
                <BoidDemo
                  demoType="alignment"
                />
              </div>
              <div className="col-span-2 flex flex-col justify-start gap-4 pl-4">
                <h3 className="text-3xl font-bold">Alinhamento</h3>
                <p className="w-full text-left text-lg">
                  Boids se alinham com a direção dos vizinhos próximos. As linhas verdes mostram a direção de cada boid, demonstrando como eles gradualmente sincronizam seus movimentos.
                </p>
                <pre className="text-left border rounded-2xl p-2 mt-2">
                  <code data-trim data-noescape>
                    {`
FUNÇÃO alinhamento(boid_atual, lista_boids, raio_alinhamento):
  velocidade_média = vetor_zero()
  contador = 0
  
  PARA CADA outro_boid EM lista_boids:
      distância = calcular_distância(boid_atual.posição, outro_boid.posição)
      
      SE distância > 0 E distância < raio_alinhamento:
          velocidade_média = velocidade_média + outro_boid.velocidade
          contador = contador + 1
  
  SE contador > 0:
      velocidade_média = velocidade_média / contador  // Média das velocidades
      velocidade_média = normalizar(velocidade_média)
      velocidade_média = velocidade_média * velocidade_máxima
      
      força_alinhamento = velocidade_média - boid_atual.velocidade  // Steering force
      força_alinhamento = limitar(força_alinhamento, força_máxima)
  SENÃO:
      força_alinhamento = vetor_zero()
  
  RETORNAR força_alinhamento
                    `}
                  </code>
                </pre>
              </div>
            </div>
          </Section>
          <Section>
            <div className="grid grid-cols-3 bg-white/50 backdrop-blur-[4px] p-8 rounded-2xl border">
              {/* Demo 3: Separação */}
              <div className="size-96 overflow-hidden rounded-2xl border col-span-1">
                <BoidDemo
                  demoType="separation"
                />
              </div>
              <div className="col-span-2 flex flex-col justify-start gap-4 pl-4">
                <h3 className="text-3xl font-bold">Separação</h3>
                <p className="w-full text-left text-lg">
                  Boids evitam colisões mantendo distância uns dos outros. As linhas vermelhas mostram a força de separação que os afasta quando ficam muito próximos.
                </p>
                <pre className="text-left border rounded-2xl p-2 mt-2">
                  <code data-trim data-noescape>
                    {`
FUNÇÃO separação(boid_atual, lista_boids, raio_separação):
  força_separação = vetor_zero()
  contador = 0
  
  PARA CADA outro_boid EM lista_boids:
      distância = calcular_distância(boid_atual.posição, outro_boid.posição)
      
      SE distância > 0 E distância < raio_separação:
          // Calcular vetor de afastamento
          diferença = boid_atual.posição - outro_boid.posição
          diferença = normalizar(diferença)
          diferença = diferença / distância  // Peso inversamente proporcional à distância
          força_separação = força_separação + diferença
          contador = contador + 1
  
  SE contador > 0:
      força_separação = força_separação / contador  // Média
      força_separação = normalizar(força_separação)
      força_separação = força_separação * velocidade_máxima
      força_separação = força_separação - boid_atual.velocidade // Steering force
      força_separação = limitar(força_separação, força_máxima)
  
  RETORNAR força_separação
                    `}
                  </code>
                </pre>
              </div>
            </div>
          </Section>
          <Section>
            <div className="grid grid-cols-3 bg-white/50 backdrop-blur-[4px] p-8 rounded-2xl border">
              {/* Demo 4: Coesão */}
              <div className="size-96 overflow-hidden rounded-2xl border col-span-1">
                <BoidDemo
                  demoType="cohesion"
                />
              </div>
              <div className="col-span-2 flex flex-col justify-start gap-4 pl-4">
                <h3 className="text-3xl font-bold">Coesão</h3>
                <p className="w-full text-left text-lg">
                  Boids se movem em direção ao centro do grupo local. Os pontos amarelos mostram o centro de massa dos vizinhos, e as linhas ciano indicam a atração para esse ponto.
                </p>
                <pre className="text-left border rounded-2xl p-2 mt-2">
                  <code data-trim data-noescape>
                    {`
FUNÇÃO coesão(boid_atual, lista_boids, raio_coesão):
  centro_massa = vetor_zero()
  contador = 0
  
  PARA CADA outro_boid EM lista_boids:
      distância = calcular_distância(boid_atual.posição, outro_boid.posição)
      
      SE distância > 0 E distância < raio_coesão:
          centro_massa = centro_massa + outro_boid.posição
          contador = contador + 1
  
  SE contador > 0:
      centro_massa = centro_massa / contador  // Centro de massa médio
      
      // Calcular direção para o centro
      direção_desejada = centro_massa - boid_atual.posição
      direção_desejada = normalizar(direção_desejada)
      direção_desejada = direção_desejada * velocidade_máxima
      
      força_coesão = direção_desejada - boid_atual.velocidade // Steering force
      força_coesão = limitar(força_coesão, força_máxima)
  SENÃO:
      força_coesão = vetor_zero()
  
  RETORNAR força_coesão
                    `}
                  </code>
                </pre>
              </div>
            </div>
          </Section>
          <Section>
            <div className="grid grid-cols-3 bg-white/50 backdrop-blur-[4px] p-8 rounded-2xl border">
              <div className="size-96 overflow-hidden rounded-2xl border col-span-1">
                <BoidDemo
                  demoType="all"
                />
              </div>
              <div className="col-span-2 flex flex-col justify-start gap-4 pl-4">
                <h3 className="text-3xl font-bold">Comportamento emergente</h3>
                <p className="w-full text-left text-lg">
                  Quando todas as três regras são combinadas, emerge o comportamento complexo de enxame. A interação entre separação, alinhamento e coesão cria padrões naturais de movimento em grupo.
                </p>
              </div>
            </div>
          </Section>
        </section>

        <section>
          <Section>
            <div className="flex flex-col bg-white/50 backdrop-blur-[4px] p-8 rounded-2xl border">
              <h2 className="text-7xl font-bold text-center">Arquitetura do Algoritmo</h2>
            </div>
          </Section>
          <Section>
            <div className="bg-white/50 backdrop-blur-[4px] p-8 rounded-2xl border">
              <h3 className="text-3xl font-bold">Loop Principal</h3>
              <ul className="list-disc pl-8 text-left">
                <li className="my-2">Percepção local: Para cada boid, identifique os vizinhos dentro do raio de interação <InlineMath math="R" /> ao seu redor.</li>
                <li className="my-2">Cálculo de forças: Com base nos vizinhos percebidos, calcule os vetores de Separação, Alinhamento e Coesão para aquele boid.</li>
                <li className="my-2">Atualização do boid: Some os vetores de força à velocidade atual do boid e atualize sua posição em seguida.</li>
              </ul>
              <pre className="text-left border rounded-2xl p-2 mt-2">
                <code data-trim data-noescape>
                  {`
FUNÇÃO atualizar_boid(boid, lista_boids, configurações):
  // Calcular forças individuais
  força_sep = separação(boid, lista_boids, configurações.raio_separação)
  força_ali = alinhamento(boid, lista_boids, configurações.raio_alinhamento)
  força_coe = coesão(boid, lista_boids, configurações.raio_coesão)
  
  // Aplicar pesos às forças
  força_sep = força_sep * configurações.peso_separação
  força_ali = força_ali * configurações.peso_alinhamento
  força_coe = força_coe * configurações.peso_coesão
  
  // Combinar todas as forças
  aceleração = força_sep + força_ali + força_coe
  
  // Atualizar velocidade e posição
  boid.velocidade = boid.velocidade + aceleração
  boid.velocidade = limitar(boid.velocidade, velocidade_máxima)
  boid.posição = boid.posição + boid.velocidade
  
  // Aplicar wrap-around nas bordas (opcional)
  aplicar_bordas(boid)
                  `}
                </code>
              </pre>
            </div>
          </Section>
          <Section>
            <div className="bg-white/50 backdrop-blur-[4px] p-8 rounded-2xl border">
              <h3 className="text-3xl font-bold">Interações e Agentes</h3>
              <ul className="list-disc pl-8 text-left">
                <li className="my-2 text-base">Algoritmo descentralizado</li>
              </ul>
            </div>
          </Section>
          <Section>
            <div className="bg-white/50 backdrop-blur-[4px] p-8 rounded-2xl border">
              <h3 className="text-3xl font-bold">Desempenho</h3>
              <ul className="list-disc pl-8 text-left">
                <li className="my-2 text-base">
                  <InlineMath math="O(n^2)" /> para <InlineMath math="n" /> boids
                </li>
              </ul>
            </div>
          </Section>
          <Section>
            <div className="bg-white/50 backdrop-blur-[4px] p-8 rounded-2xl border">
              <h3 className="text-3xl font-bold">Regras adicionais</h3>
              <ul className="list-disc pl-8 text-left">
                <li className="my-2 text-base">Evitar Obstáculos</li>
                <li className="my-2 text-base">Confinamento do Espaço</li>
                <li className="my-2 text-base">Objetivo (Goal Seeking)</li>
              </ul>
            </div>
          </Section>
        </section>

        <section>
          <Section>
            <div className="bg-white/50 backdrop-blur-[4px] p-8 rounded-2xl border">
              <h2 className="text-7xl font-bold text-center">Outros modelos/Variações</h2>
              <ul className="list-disc py-8 text-left">
                <li className="my-2 text-base">
                  Modelo de Vicsek: <br />
                </li>
                <li className="my-2 text-base">
                  Modelo de Couzin: <br />
                </li>
                <li className="my-2 text-base">
                  Modelo Cucker-Smale <br />
                </li>
                <li className="my-2 text-base">
                  Sistemas de Forças em Multidões <br />
                </li>
              </ul>
            </div>
          </Section>
        </section>

        <section>
          <Section>
            <div className="bg-white/50 backdrop-blur-[4px] p-8 rounded-2xl border">
              <h2 className="text-7xl font-bold text-center">Aplicações Práticas e Variações do Boids</h2>
            </div>
          </Section>
          <Section>
            <div className="bg-white/50 backdrop-blur-[4px] p-8 rounded-2xl border">
              <h3 className="text-3xl font-bold">Animação e Cinema (VFX)</h3>
              <ul className="list-disc py-8 text-left">
                <li className="my-2 text-base">
                  <Link href="https://www.youtube.com/watch?v=pbFEQv259yw" target="_blank" rel="noopener noreferrer">
                    Stanley and Stella in: Breaking the Ice
                  </Link>
                </li>
                <li className="my-2 text-base">
                  <Link href="https://www.youtube.com/watch?v=A8Xt3DlrwhY" target="_blank" rel="noopener noreferrer">
                    Batman Returns (1992)
                  </Link>
                </li>
              </ul>
            </div>
          </Section>
          <Section>
            <div className="bg-white/50 backdrop-blur-[4px] p-8 rounded-2xl border">
              <h3 className="text-3xl font-bold">Jogos Eletrônicos</h3>
              <ul className="list-disc py-8 text-left">
                <li className="my-2 text-base">
                  Half-life
                  <NextImage
                    src="/half-life.gif"
                    alt="Half-life - Jogo de tiro em primeira pessoa com comportamento de inimigos"
                    width={600}
                    height={400}
                    className="size-full object-cover rounded-2xl mt-2"
                  />
                </li>
                <li className="my-2 text-base">
                  ABZÛ
                  <NextImage
                    src="/abzu.gif"
                    alt="ABZÛ - Jogo de exploração subaquática com comportamento de peixes"
                    width={600}
                    height={400}
                    className="size-full object-cover rounded-2xl mt-2"
                  />
                </li>
              </ul>
            </div>
          </Section>
          <Section>
            <div className="bg-white/50 backdrop-blur-[4px] p-8 rounded-2xl border">
              <h3 className="text-3xl font-bold">Robótica de Enxame</h3>
              <h3 className="text-3xl font-bold">Biologia e Ecologia Computacional</h3>
            </div>
          </Section>
        </section>

        <section>
          <Section>
            <div className="bg-white/50 backdrop-blur-[4px] p-8 rounded-2xl border">
              <h1 className="text-7xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-32">
                Fim
              </h1>
            </div>
          </Section>
        </section>

        <section>
          <Section>

          </Section>
        </section>
      </RevealProvider>
    </div>
  );
}

type SectionProps = {
  children?: React.ReactNode;
  className?: string;
}

function Section(props: SectionProps) {
  return (
    <section className="min-h-svh h-full">
      <div
        className={
          cn("size-full flex flex-col items-center justify-center relative", props.className)
        }
      >
        {props.children}
      </div>
    </section>
  );
}