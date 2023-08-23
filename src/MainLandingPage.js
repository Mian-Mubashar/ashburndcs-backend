import React from "react";
import tw from "twin.macro";
import FAQ from "components/faqs/SingleCol.js";
import Hero from "components/hero/HeaderHero";
import Pricing from "components/pricing/Pricing";
import GetStarted from "components/cta/GetStartedLight.js";
import FeatureStats from "components/features/StatFeature";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import Footer from "components/footers/FiveColumnWithInputForm.js";
import Features from "components/features/ThreeColWithSideImage.js";
import { FeatureData, MainFeatureData } from "AppData/MainFeatureData";
import Testimonial from "components/testimonials/Testimonial";
import MainFeature from "components/features/TwoColWithTwoHorizontalFeaturesAndButton.js";
import { TestimonialData } from "AppData/TestimonialData";

const HighlightedText = tw.span`text-primary-500`;

export default () => {
  return (
    <AnimationRevealPage>
      <Hero roundedHeaderButton={true} />
      {FeatureData.map((value, i) => (
        <Features
          key={i}
          heading={value.heading}
          subheading={value.subheading}
          description={value.description}
        />
      ))}
      <FeatureStats />
      {MainFeatureData.map((value, i) => (
        <MainFeature
          key={i}
          heading={value.heading}
          imageSrc={value.imageSrc}
          subheading={value.subheading}
          textOnLeft={value.textOnLeft}
          description={value.description}
          primaryButtonText={value.primaryButtonText}
        />
      ))}

      <Testimonial
        heading={TestimonialData.heading}
        imageSrc={TestimonialData.imageSrc}
        subheading={TestimonialData.subheading}
        textOnLeft={TestimonialData.textOnLeft}
        imageBorder={TestimonialData.imageBorder}
        imageShadow={TestimonialData.imageShadow}
        description={TestimonialData.description}
        testimonials={TestimonialData.testimonials}
        imageRounded={TestimonialData.imageRounded}
      />
      <Pricing
        heading={
          <>
            Flexible <HighlightedText>Plans</HighlightedText>
          </>
        }
      />
      <FAQ
        heading={
          <>
            Any <HighlightedText>Questions ?</HighlightedText>
          </>
        }
      />
      <GetStarted />
      <Footer />
    </AnimationRevealPage>
  );
};
