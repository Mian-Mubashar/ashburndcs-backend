import React, { useState } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import {
  SectionHeading,
  Subheading as SubheadingBase,
} from "components/misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import EmailIllustrationSrc from "images/email-illustration.svg";
import { collection, addDoc } from "firebase/firestore";
import { db } from "FireBase";
import { Toast } from "helpers/Alert";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-20 md:py-24`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:w-5/12 flex-shrink-0 h-80 md:h-auto`;
const TextColumn = styled(Column)((props) => [
  tw`md:w-7/12 mt-16 md:mt-0`,
  props.textOnLeft
    ? tw`md:mr-12 lg:mr-16 md:order-first`
    : tw`md:ml-12 lg:ml-16 md:order-last`,
]);

const Image = styled.div((props) => [
  `background-image: url("${props.imageSrc}");`,
  tw`rounded bg-contain bg-no-repeat bg-center h-full`,
]);
const TextContent = tw.div`lg:py-8 text-center md:text-left`;

const Subheading = tw(SubheadingBase)`text-center md:text-left`;
const Heading = tw(
  SectionHeading
)`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;
const Description = tw.p`mt-4 text-center md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`;

const Form = tw.form`mt-8 md:mt-10 text-sm flex flex-col max-w-sm mx-auto md:mx-0`;
const Input = tw.input`mt-6 first:mt-0 border-b-2 py-3 focus:outline-none font-medium transition duration-300 hocus:border-primary-500`;
const Textarea = styled(Input).attrs({ as: "textarea" })`
  ${tw`h-24`}
`;

const SubmitButton = tw(PrimaryButtonBase)`inline-block mt-8`;

export default ({
  subheading = "Contact Us",
  heading = (
    <>
      Feel free to <span tw="text-primary-500">get in touch</span>
      <wbr /> with us.
    </>
  ),
  description = "Connect with Ashburn's dedicated tech experts for reliable solutions. Reach out now for prompt assistance with your technical needs",
  submitButtonText = "Send",
  textOnLeft = true,
}) => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const handleChange = ({ target: { name, value } }) =>
    setData({ ...data, [name]: value });
  const addContact = async (e) => {
    e.preventDefault();
    if (
      data.name === "" ||
      data.email === "" ||
      data.subject === "" ||
      data.message === ""
    ) {
      Toast({message:"Please fill all data in the fields",type:"info"})

    } else {
      try {
        axios.post('http://localhost:4200/api/contact', {
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
        // console.log("Document written with ID: ", docRef.id);
      // Toast({message:"Submitted Data Successfully"})
      // navigate("/");


      } catch (e) {
        // console.error("Error adding document: ", e);
      Toast({message:e.message})

      }
    }
  };

  return (
    <Container>
      <TwoColumn>
        <ImageColumn>
          <Image imageSrc={EmailIllustrationSrc} />
        </ImageColumn>
        <TextColumn textOnLeft={textOnLeft}>
          <TextContent>
            {subheading && <Subheading>{subheading}</Subheading>}
            <Heading>{heading}</Heading>
            {description && <Description>{description}</Description>}
            <Form>
              <Input
                type="email"
                name="email"
                id="email"
                required
                onChange={handleChange}
                placeholder="Your Email Address"
              />
              <Input
                type="text"
                name="name"
                id="name"
                required
                onChange={handleChange}
                placeholder="Full Name"
              />
              <Input
                type="text"
                name="subject"
                id="subject"
                required
                onChange={handleChange}
                placeholder="Subject"
              />
              <Textarea
                name="message"
                id="subject"
                required
                onChange={handleChange}
                placeholder="Your Message Here"
              />
              <SubmitButton onClick={addContact}>
                {submitButtonText}
              </SubmitButton>
            </Form>
          </TextContent>
        </TextColumn>
      </TwoColumn>
    </Container>
  );
};
