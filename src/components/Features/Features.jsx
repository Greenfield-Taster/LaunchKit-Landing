import {
  Code,
  Palette,
  TrendingUp,
  BarChart3,
  Headphones,
  MessageSquare,
} from "lucide-react";
import AnimatedSection from "../AnimatedSection/AnimatedSection";
import { useLanguage } from "../../contexts/language/useLanguage";
import "./Features.scss";

const icons = [Code, Palette, TrendingUp, BarChart3, Headphones, MessageSquare];

const Features = () => {
  const { t } = useLanguage();
  const items = t("features.items");

  return (
    <section id="features" className="features">
      <div className="features__container container">
        <AnimatedSection>
          <h2 className="features__title">{t("features.title")}</h2>
        </AnimatedSection>

        <div className="features__grid">
          {items.map((item, index) => {
            const Icon = icons[index];
            const isWide = index === 0 || index === 3;

            return (
              <AnimatedSection
                key={index}
                className={`features__card${isWide ? " features__card--wide" : ""}`}
                delay={0.1 * index}
              >
                <div className="features__icon-wrapper">
                  <Icon size={24} />
                </div>
                <h3 className="features__card-title">{item.title}</h3>
                <p className="features__card-description">{item.description}</p>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
