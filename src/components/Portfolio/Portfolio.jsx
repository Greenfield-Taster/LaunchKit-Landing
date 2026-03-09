import AnimatedSection from "../AnimatedSection/AnimatedSection";
import { useLanguage } from "../../contexts/language/useLanguage";
import "./Portfolio.scss";

const gradients = [
  { from: "#6C3CE0", to: "#a78ef0" },
  { from: "#5a30b8", to: "#6fcb2e" },
  { from: "#472693", to: "#3b82f6" },
  { from: "#8a5fe8", to: "#f59e0b" },
  { from: "#311a66", to: "#10b981" },
  { from: "#6C3CE0", to: "#ef4444" },
];

const PlaceholderSVG = ({ index, gradient }) => (
  <svg
    className="portfolio__svg"
    viewBox="0 0 400 300"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id={`pg-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={gradient.from} stopOpacity="0.8" />
        <stop offset="100%" stopColor={gradient.to} stopOpacity="0.4" />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill={`url(#pg-${index})`} />
    {/* Geometric decorations */}
    <circle
      cx={80 + index * 40}
      cy={60 + index * 20}
      r={30 + index * 5}
      fill="rgba(255,255,255,0.08)"
    />
    <rect
      x={200 + index * 15}
      y={150 - index * 10}
      width={60 + index * 8}
      height={60 + index * 8}
      rx="8"
      fill="rgba(255,255,255,0.06)"
      transform={`rotate(${index * 15} ${230 + index * 15} ${180 - index * 10})`}
    />
    <line
      x1="40"
      y1={200 + index * 10}
      x2={300 - index * 20}
      y2={220 - index * 5}
      stroke="rgba(255,255,255,0.1)"
      strokeWidth="2"
    />
    <text
      x="200"
      y="160"
      textAnchor="middle"
      fill="rgba(255,255,255,0.15)"
      fontSize="48"
      fontWeight="bold"
      fontFamily="Inter, sans-serif"
    >
      {index + 1}
    </text>
  </svg>
);

const Portfolio = () => {
  const { t } = useLanguage();
  const items = t("portfolio.items");

  const sizeClasses = [
    "portfolio__item--featured",
    "",
    "",
    "portfolio__item--tall",
    "",
    "",
  ];

  return (
    <section id="portfolio" className="portfolio">
      <div className="portfolio__container container">
        <AnimatedSection>
          <h2 className="portfolio__title">{t("portfolio.title")}</h2>
        </AnimatedSection>

        <div className="portfolio__grid">
          {items.map((item, index) => (
            <AnimatedSection
              key={index}
              className={`portfolio__item ${sizeClasses[index]}`.trim()}
              delay={0.1 * index}
            >
              <PlaceholderSVG index={index} gradient={gradients[index]} />
              <div className="portfolio__overlay">
                <h3 className="portfolio__item-title">{item.title}</h3>
                <span className="portfolio__item-category">{item.category}</span>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
