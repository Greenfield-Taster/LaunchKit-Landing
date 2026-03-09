import AnimatedSection from "../AnimatedSection/AnimatedSection";
import { useLanguage } from "../../contexts/language/useLanguage";
import "./Partners.scss";

const partnerLogos = Array.from({ length: 8 }, (_, i) => {
  const shapes = [
    <circle cx="30" cy="30" r="8" fill="rgba(108,60,224,0.6)" key="s" />,
    <rect x="22" y="22" width="16" height="16" rx="3" fill="rgba(108,60,224,0.6)" key="s" />,
    <polygon points="30,18 40,38 20,38" fill="rgba(108,60,224,0.6)" key="s" />,
    <circle cx="30" cy="30" r="10" fill="none" stroke="rgba(108,60,224,0.6)" strokeWidth="2" key="s" />,
    <rect x="20" y="20" width="20" height="20" rx="10" fill="rgba(108,60,224,0.5)" key="s" />,
    <polygon points="30,16 36,28 44,28 38,36 40,48 30,40 20,48 22,36 16,28 24,28" fill="rgba(108,60,224,0.4)" key="s" />,
    <line x1="18" y1="30" x2="42" y2="30" stroke="rgba(108,60,224,0.6)" strokeWidth="3" strokeLinecap="round" key="s" />,
    <rect x="24" y="24" width="12" height="12" fill="rgba(108,60,224,0.6)" transform="rotate(45 30 30)" key="s" />,
  ];

  return {
    id: i + 1,
    shape: shapes[i],
  };
});

const PartnerLogo = ({ partner }) => (
  <svg
    className="partners__logo"
    viewBox="0 0 200 60"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      width="198"
      height="58"
      x="1"
      y="1"
      rx="8"
      fill="transparent"
      stroke="rgba(255,255,255,0.1)"
      strokeWidth="1"
    />
    <g transform="translate(70, 0)">
      {partner.shape}
    </g>
    <text
      x="100"
      y="50"
      textAnchor="middle"
      fill="rgba(255,255,255,0.4)"
      fontSize="11"
      fontFamily="Inter, sans-serif"
    >
      Partner {partner.id}
    </text>
  </svg>
);

const MarqueeRow = ({ partners, reverse = false }) => (
  <div className={`partners__marquee-track${reverse ? " partners__marquee-track--reverse" : ""}`}>
    <div className="partners__marquee-inner">
      {partners.map((p) => (
        <PartnerLogo key={`a-${p.id}`} partner={p} />
      ))}
      {partners.map((p) => (
        <PartnerLogo key={`b-${p.id}`} partner={p} />
      ))}
    </div>
  </div>
);

const Partners = () => {
  const { t } = useLanguage();

  return (
    <section id="partners" className="partners">
      <div className="partners__container container">
        <AnimatedSection>
          <h2 className="partners__title">{t("partners.title")}</h2>
        </AnimatedSection>
      </div>

      <div className="partners__marquee">
        <MarqueeRow partners={partnerLogos.slice(0, 8)} />
        <MarqueeRow partners={partnerLogos.slice(0, 8)} reverse />
      </div>
    </section>
  );
};

export default Partners;
