import "./GlowBackground.scss";

const GlowBackground = () => {
  return (
    <div className="glow-background" aria-hidden="true">
      <div className="glow-background__orb glow-background__orb--primary" />
      <div className="glow-background__orb glow-background__orb--secondary" />
      <div className="glow-background__orb glow-background__orb--accent" />
      <div className="glow-background__orb glow-background__orb--subtle" />
    </div>
  );
};

export default GlowBackground;
