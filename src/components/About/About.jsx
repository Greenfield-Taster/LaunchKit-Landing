import AnimatedSection from "../AnimatedSection/AnimatedSection";
import { useLanguage } from "../../contexts/language/useLanguage";
import "./About.scss";

const About = () => {
  const { t } = useLanguage();
  const stats = t("about.stats");

  return (
    <section id="about" className="about">
      <div className="about__container container">
        <AnimatedSection>
          <h2 className="about__title">{t("about.title")}</h2>
        </AnimatedSection>

        <div className="about__content">
          <AnimatedSection className="about__text-wrapper" direction="left">
            <div className="about__accent" />
            <p className="about__description">{t("about.description")}</p>
          </AnimatedSection>

          <div className="about__stats">
            {stats.map((stat, index) => (
              <AnimatedSection
                key={index}
                className="about__stat-card"
                delay={0.1 * (index + 1)}
              >
                <span className="about__stat-value">{stat.value}</span>
                <span className="about__stat-label">{stat.label}</span>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
