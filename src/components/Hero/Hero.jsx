import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useLanguage } from "../../contexts/language/useLanguage";
import "./Hero.scss";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] },
  }),
};

const Hero = () => {
  const { t } = useLanguage();

  const handleCtaClick = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero">
      <div className="hero__content container">
        <motion.h1
          className="hero__title"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          {t("hero.title")}
        </motion.h1>

        <motion.p
          className="hero__subtitle"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.button
          className="hero__cta"
          type="button"
          onClick={handleCtaClick}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.4}
        >
          {t("hero.cta")}
          <ArrowDown size={20} />
        </motion.button>
      </div>
    </section>
  );
};

export default Hero;
