import React from "react";
import tw from "twin.macro";

import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";

const SubmitButton = tw(PrimaryButtonBase)`inline-block mt-8`;

const WhatsAppContact = () => {
  const phoneNumber = "+15715313630";

  const openWhatsAppChat = () => {
    const url = `https://wa.me/${phoneNumber}`;
    window.open(url, "_blank");
  };

  return (
    <SubmitButton onClick={openWhatsAppChat}>Chat on WhatsApp</SubmitButton>
  );
};

export default WhatsAppContact;
