//* Components imports
import { RevealProvider } from "@/components/providers/reveal";

export default function Home() {
  return (
    <RevealProvider>
      <section>
        <h1>Welcome to My Presentation</h1>
        <p>This is the first slide of my presentation.</p>
      </section>
      <section>
        <h2>Slide 2</h2>
        <p>This is the second slide of my presentation.</p>
      </section>
    </RevealProvider>
  );
}
