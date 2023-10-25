import React from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import Hero from "./HeroHeader";
import Features from "components/features/VerticalWithAlternateImageAndText.js";
import Blog from "components/blogs/ThreeColSimpleWithImage.js";
import ContactUsForm from "components/forms/SimpleContactUs.js";
import Footer from "components/footers/SimpleFiveColumn.js";

export default () => (
  <AnimationRevealPage>
    <Hero />
    <Features />

    <Footer />    {/* <Blog />
    <ContactUsForm /> */}
  </AnimationRevealPage>
);
