/**
 * Art-directed stand-in for fine-art photography. Renders light,
 * atmosphere, and texture through layered gradients rather than stock
 * imagery, keyed by a named treatment. See src/content/README.md for how
 * to swap a treatment key for a real photograph later.
 */

export type AtmosphereTreatment =
  | "sunrise-ridge"
  | "mountain-mist"
  | "wheat-field"
  | "window-light"
  | "harbor-dawn"
  | "candle-glow"
  | "storm-light"
  | "ocean-horizon"
  | "desert-road"
  | "forest-light";

const treatments: Record<AtmosphereTreatment, string> = {
  "sunrise-ridge":
    "radial-gradient(130% 90% at 50% 110%, rgba(184,146,75,0.55) 0%, rgba(184,146,75,0.08) 38%, transparent 60%), linear-gradient(180deg, #221c13 0%, #3a2e1d 38%, #7a5a33 68%, #c99a5b 100%)",
  "mountain-mist":
    "linear-gradient(180deg, #0e1a16 0%, #1f332b 30%, #44594c 55%, #8a9a8c 78%, #d8d2bf 100%)",
  "wheat-field":
    "linear-gradient(180deg, #caa54a 0%, #cf9e4e 35%, #b9822f 65%, #4e3a1c 100%)",
  "window-light":
    "radial-gradient(60% 50% at 70% 20%, rgba(247,230,180,0.65) 0%, rgba(247,230,180,0.0) 55%), linear-gradient(160deg, #2a2316 0%, #1a160f 100%)",
  "harbor-dawn":
    "linear-gradient(180deg, #2a2f36 0%, #4f5c61 32%, #96a39c 55%, #d8c9a3 78%, #efdfb7 100%)",
  "candle-glow":
    "radial-gradient(45% 45% at 50% 55%, rgba(201,165,104,0.75) 0%, rgba(120,90,45,0.25) 45%, transparent 70%), #0f0d09",
  "storm-light":
    "linear-gradient(200deg, #1b2027 0%, #30363c 35%, #596158 60%, #9a9078 80%, #d9c89a 100%)",
  "ocean-horizon":
    "linear-gradient(180deg, #223238 0%, #41585a 38%, #8e9b8d 62%, #ead9ab 100%)",
  "desert-road":
    "linear-gradient(180deg, #d9b979 0%, #c99a5e 45%, #8c6a40 72%, #40301d 100%)",
  "forest-light":
    "radial-gradient(55% 40% at 50% 10%, rgba(201,201,150,0.35) 0%, transparent 60%), linear-gradient(180deg, #0c1611 0%, #16281f 40%, #223b2c 70%, #0b140f 100%)",
};

interface AtmosphereProps {
  treatment: AtmosphereTreatment;
  alt: string;
  className?: string;
  grain?: boolean;
  children?: React.ReactNode;
}

export default function Atmosphere({
  treatment,
  alt,
  className = "",
  grain = true,
  children,
}: AtmosphereProps) {
  const hasOwnPosition = /\b(absolute|fixed|sticky|relative)\b/.test(className);

  return (
    <div
      role="img"
      aria-label={alt}
      className={`overflow-hidden ${hasOwnPosition ? "" : "relative"} ${className}`}
      style={{ background: treatments[treatment] }}
    >
      {grain && <div className="grain" aria-hidden="true" />}
      {children}
    </div>
  );
}
