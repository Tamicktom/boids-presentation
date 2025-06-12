## Contexto histórico

Boids é um algoritmo que busca por meio de regras básicas, reproduzir o comportamento sincronizado de grupos de animais. Por exemplo, manadas de animais terrestres, cardumes de peixes, bando de pássaros e etc.

O modelo já fora utilizado para diversas implementações e estudos:

- Estudo comportamental de medo
- interação entre animais via olfato modelando feromônios
- mudança de liderança de um bando, dentre muitas outras aplicações interessantes.

Modelo de Vicsek, cientista húngaro.

- Modelo simplificado de BOID para estudo de transições de fase de um sistema desordenado para um estado ordenado de larga escala.
- Transição espontânea, exemplo de movimento coletivo.

- Modelo popular na área de física.

O movimento de animais em sincronia é extremamente complexo.
Chave para sobrevivência deles

## Arquitetura do Algoritmo

- São sorteadas posições e velocidades aleatórias para os boids.

- As regras são calculadas em cada passo temporal.

- Embora tenham liberdade, o comportamento de cada boid é influênciado apenas por outros dentro de uma região, chamada de Raio de Interação (R)

### Loop Principal

Boids opera em um laço contínuo de simulação. Em cada passo de tempo (frame), aplica-se:

- Percepção local: cada boid, identifica os vizinhos dentro do raio de interação ao seu redor

- Cálculo de forças: Com base nos vizinhos percebidos, calcule os vetores de Separação, Alinhamento e Coesão para aquele boid

- Atualização: Seome os vetores de força a valocidade atual do boid e atualize sua posição. Opcionalmente aplique limites de velocidade.

### Interação e agentes

- inteiramente descentralizado: cada boid toma decisões apenas com base em vizinhos próximos e algumas contantes globais.

- Não há um controlador global coordenando o bando.

- Essa arquitetura reflete fenômenos naturais de auto-organização, onde a coesão global surge de interações locais simples.

- Torna o modelo escalável conceitualmente: Acrescentar mais agentes não muda as regras, apenas aumenta a carga de cálculo.

### Desempenho

- Boids exige verificar todos os pares de boids para determinar vizinhos, o que resulta em O(N^2) por passo para N.

- Para simular milhares, implementações práticas utilizam outras estruturas de dados.
Pode-se dividir em uma grade ou usar uma árvore (quad-tree, octree, kd-tree) para limitar as comparações
Bibliotecas como OpenSteer de Reynolds incluem um "spatial database" para gerenciar isso.

https://opensteer.sourceforge.net/doc.html#:~:text=Boids%3A%20200%20simulated%20flocking%20bird,opposite%20side%20of%20the%20sphere

### Regras adicionais

Além das três regras básicas, é comum incorporar comportamentos extras no loop principal

- Evitar Obstáculos: Cada boid

## Aplicações práticas

### Animação e Cinema
Stanley and Stella in: Breaking the Ice
- A primeira demonstração do Boids foi em um curta-metragem de 1987

Batman Returns (1992)
- foi usado para animar digitalmente enxames de morcegos e um exército de pinguins de forma realista

A partir dai Boids e variantes tornaram-se ferramentas padrão na indústria.

bandos de pássaros, cardumes de peixes, colônias de criaturas fantasiosas ou multidões de pessoas, sem precisar animar manualmente cada indivíduo

