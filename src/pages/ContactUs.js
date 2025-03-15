import React from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import Header from "components/headers/light.js";
import Footer from "components/footers/MiniCenteredFooter";
import ContactUsForm from "components/forms/ContactUsForm";
import ContactDetails from "components/cards/ThreeColContactDetails.js";

const Address = tw.span`leading-relaxed`;
const AddressLine = tw.span`block`;
const Email = tw.span`text-sm mt-6 block text-gray-500`;
const Phone = tw.span`text-sm mt-0 block text-gray-500`;

export default () => {
  return (
    <AnimationRevealPage>
      <Header />
      <ContactUsForm />
      <ContactDetails
        cards={[
          {
            title: "United States",
            description: (
              <>
                <Address>
                  <AddressLine>ADCS</AddressLine>
                  <AddressLine>Data center Solution</AddressLine>
                </Address>
                <Email>ashburndcsolutions@gmail.com</Email>
                <Phone>+1 (571) 531-3630</Phone><br/>
                <Phone >Give us a call before you visit 😇</Phone>
                <Phone>22640 Glenn Dr 102 Sterling VA 20164</Phone>
              </>
            ),
          },
        ]}
      />
      <Footer />
    </AnimationRevealPage>
  );
};
