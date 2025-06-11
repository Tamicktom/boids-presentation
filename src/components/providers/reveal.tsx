"use client";
//* Libraries imports
import React from "react";
import Reveal from "reveal.js";
import { KaTeX } from "reveal.js/plugin/math/math"

import "reveal.js/dist/reveal.css";
// import "reveal.js/dist/theme/white.css";

type RevealProviderProps = {
  children?: React.ReactNode;
};

export function RevealProvider(props: RevealProviderProps) {
  const deckDivRef = React.useRef<HTMLDivElement>(null); // reference to deck container div
  const deckRef = React.useRef<Reveal.Api | null>(null); // reference to deck reveal instance

  React.useEffect(() => {
    // Prevents double initialization in strict mode
    if (deckRef.current) return;

    deckRef.current = new Reveal(deckDivRef.current!, {
      transition: "slide",
      // other config options
      plugins: [KaTeX],
      // embedded: true,
      disableLayout: true, // Disable layout to prevent resizing issues
    });

    deckRef.current.initialize().then(() => {
      // good place for event handlers and plugin setups
    });

    deckRef.current.layout(); // Force initial layout

    return () => {
      try {
        if (deckRef.current) {
          deckRef.current.destroy();
          deckRef.current = null;
        }
      } catch (e) {
        console.warn("Reveal.js destroy call failed.", e);
      }
    };
  }, []);

  return (
    // Your presentation is sized based on the width and height of
    // our parent element. Make sure the parent is not 0-height.
    <div
      ref={deckDivRef}
      className="reveal bg-transparent"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="slides">
        {props.children}
      </div>
    </div>
  );
}
