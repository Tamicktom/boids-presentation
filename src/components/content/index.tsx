"use client";
//* Libraries imports
import dynamic from "next/dynamic";
import NextImage from "next/image";
import Link from "next/link";
import { BlockMath } from 'react-katex';

import 'katex/dist/katex.min.css';

//* Components imports
import { RevealProvider } from "@/components/providers/reveal";

//* Utils imports
import { cn } from "@/lib/utils";

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
              <h2 className="text-7xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-32">
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
              <h2 className="text-7xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-32">Princípios Fundamentais</h2>
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
            <h2>
              Descrição Matemática
            </h2>
          </Section>
          <Section>
            <BlockMath math="J(\theta_0,\theta_1) = \sum_{i = 0}" />
          </Section>
        </section>

        <section>
          <Section>
            <h2>Arquitetura do Algoritmo</h2>
          </Section>
          <Section>

          </Section>
        </section>

        <section>
          <Section>
            <h2>Comparações com Outras Abordagens de Comportamento Coletivo</h2>
          </Section>
          <Section>

          </Section>
        </section>

        <section>
          <Section>
            <h2>Aplicações Práticas e Variações do Boids</h2>
          </Section>
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