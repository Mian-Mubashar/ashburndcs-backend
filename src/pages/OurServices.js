import React from "react";
import tw from "twin.macro";
import Header from "components/headers/light.js";
import ShieldIconImage from "images/shield-icon.svg";
import SupportIconImage from "images/support-icon.svg";
import CustomerLoveIconImage from "images/simple-icon.svg";
import Features from "components/features/ThreeColSimple.js";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import Footer from "components/footers/FiveColumnWithInputForm.js";
import TeamCardGrid from "components/cards/ProfileThreeColGrid.js";
import MainFeature1 from "components/features/TwoColWithButton.js";
import { serviceData } from "AppData/ServiceData";

const Subheading = tw.span`uppercase tracking-wider text-sm`;

export default () => {
  return (
    <AnimationRevealPage>
      <Header />


      {serviceData.map((value) => (
        <MainFeature1
          subheading={<Subheading>{value.subheading}</Subheading>}
          heading={value.heading}
          description={value.description}
          imageSrc={value.imageSrc}
          buttonRounded={false}
          primaryButtonText={value.primaryButtonText}
          textOnLeft={value.textOnLeft}
        />
      ))}
    
      <Features
        subheading={<Subheading>Our Values</Subheading>}
        heading="We follow these."
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        cards={[
          {
            imageSrc: SupportIconImage,
            title: "24/7 Support",
            description:
              "Lorem ipsum donor amet siti ceali placeholder text alipiscing elit sed do eiusmod temport",
          },
          {
            imageSrc: ShieldIconImage,
            title: "Strong Teams",
            description:
              "Lorem ipsum donor amet siti ceali placeholder text alipiscing elit sed do eiusmod temport",
          },
          {
            imageSrc: CustomerLoveIconImage,
            title: "Customer Satisfaction",
            description:
              "Lorem ipsum donor amet siti ceali placeholder text alipiscing elit sed do eiusmod temport",
          },
        ]}
        linkText=""
      />
      <TeamCardGrid subheading={<Subheading>Our Team</Subheading>} />

      <Footer />
    </AnimationRevealPage>
  );
};
