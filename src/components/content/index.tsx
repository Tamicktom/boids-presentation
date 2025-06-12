"use client";
//* Libraries imports
import dynamic from "next/dynamic";
import NextImage from "next/image";
import { BlockMath } from 'react-katex';

import 'katex/dist/katex.min.css';

//* Components imports
import { RevealProvider } from "@/components/providers/reveal";

//* Utils imports
import { cn } from "@/lib/utils";

const Boids = dynamic(() => import("@/components/boids2d"), {
  ssr: false,
});

export function Content() {
  return (
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
        <section>
          <h2>História</h2>
        </section>

        <section>
          <div className="w-full grid grid-cols-3 items-center justify-center gap-4">
            <div className="flex justify-center max-w-64 max-h-64 size-64 col-span-1">
              <NextImage
                src="/craig-reynolds.png"
                alt="Craig Reynolds - Criador do algoritmo Boids em 1986."
                width={600}
                height={600}
                className="size-full object-cover rounded-2xl"
              />
            </div>

            <div className="col-span-2 text-xl border rounded-2xl p-4 bg-background">
              <ul className="list-none">
                <li className="border-b pb-2 list-none">
                  {'Reynalds publica o artigo "Flocks, Herds, and Schools: A Distributed Behavioral Model" em 1987.'}
                </li>
                <li className="border-b pb-2 list-none">

                </li>
              </ul>
            </div>
          </div>
        </section>
      </section>

      <section>
        <h2>Princípios Fundamentais</h2>
        <div>
          <ul>
            <li>
              Separação (evitar colisões entre boids)
            </li>
            <li>
              Alinhamento (ajustar direção com vizinhos)
            </li>
            <li>
              Coesão (mover em direção ao centro do grupo)
            </li>
          </ul>
        </div>
      </section>
      <section>
        <h2>
          Descrição Matemática
        </h2>
      </section>

      <section>
        <h2>Arquitetura do Algoritmo</h2>
      </section>

      <section>
        <h2>Comparações com Outras Abordagens de Comportamento Coletivo</h2>
      </section>

      <section>
        <h2>Aplicações Práticas e Variações do Boids</h2>
      </section>

      {/* </section> */}
      <section data-markdown>
        <BlockMath math="J(\theta_0,\theta_1) = \sum_{i = 0}" />
      </section>

      <section>
        <h2>Slide 2</h2>
        <p>This is the second slide of my presentation.</p>
      </section>
    </RevealProvider>
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
        <div className="absolute left-0 top-0 size-full z-0">
          <Boids />
        </div>
        {props.children}
      </div>
    </section>
  );
}