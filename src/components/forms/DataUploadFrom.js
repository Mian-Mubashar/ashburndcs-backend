import React, { useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import { ReactComponent as SvgDotPatternIcon } from "../../images/dot-pattern.svg";
import { useNavigate } from "react-router-dom";
import { Toast } from "helpers/Alert";
import axios from "axios";

const Container = tw.div`relative`;
const Content = tw.div`max-w-screen-xl mx-auto py-20 lg:py-24`;

const FormContainer = styled.div`
  ${tw`p-10 sm:p-12 md:p-16 bg-primary-500 text-gray-100 rounded-lg relative`}
  form {
    ${tw`mt-4`}
  }
  h2 {
    ${tw`text-3xl sm:text-4xl font-bold`}
  }
  input,
  textarea {
    ${tw`w-full bg-transparent text-gray-100 text-base font-medium tracking-wide border-b-2 py-2 text-gray-100 hocus:border-pink-400 focus:outline-none transition duration-200`};

    ::placeholder {
      ${tw`text-gray-500`}
    }
  }
`;

const TwoColumn = tw.div`flex flex-col sm:flex-row justify-between`;
const Column = tw.div`sm:w-5/12 flex flex-col`;
const InputContainer = tw.div`relative py-5 mt-6`;
const Label = tw.label`absolute top-0 left-0 tracking-wide font-semibold text-sm`;
const Input = tw.input``;
const TextArea = tw.textarea`h-24 sm:h-full resize-none`;
const SubmitButton = tw.button`w-full sm:w-32 mt-6 py-3 bg-gray-100 text-primary-500 rounded-full font-bold tracking-wide shadow-lg uppercase text-sm transition duration-300 transform focus:outline-none focus:shadow-outline hover:bg-gray-300 hover:text-primary-700 hocus:-translate-y-px hocus:shadow-xl`;

const SvgDotPattern1 = tw(
  SvgDotPatternIcon
)`absolute bottom-0 right-0 transform translate-y-1/2 translate-x-1/2 -z-10 opacity-50 text-primary-500 fill-current w-24`;

export default ({ service = false, handleOpen }) => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    heading: "",
    subHeading: "",
    description: "",
    primaryButtonText: "",
    file: null,
  });
  const handleChange = ({ target: { name, value } }) =>
    setData({ ...data, [name]: value });
  const addData = async (e) => {
    console.log(data);
    e.preventDefault();
    if (
      data.heading === "" ||
      data.subHeading === "" ||
      data.description === "" ||
      data.primaryButtonText === "" ||
      data.file === null
    ) {
      Toast({ message: "Please fill all data in the fields", type: "info" });
    } else {
      try {
        const formData = new FormData();

        formData.append("heading", data.heading);
        formData.append("subHeading", data.subHeading);
        formData.append("description", data.description);
        formData.append("primaryButtonText", data.primaryButtonText);
        formData.append("file", data.file);

        axios
          .post("http://localhost:4200/api/learning/create", formData)
          .then(function (response) {
            // navigate("/new-data");
            handleOpen();
            Toast({ message: response.message });
          });

        // console.log("Document written with ID: ", docRef.id);
        // Toast({message:"Submitted Data Successfully"})
        // navigate("/");
      } catch (e) {
        // console.error("Error adding document: ", e);
        Toast({ message: e.message });
      }
    }
  };
  const uploadImage = (event) => {
    setData({ ...data, file: event.target.files[0] });
  };
  
  return (
    <div tw="mx-auto max-w-4xl">
      <h2>Organize your data</h2>
      <TwoColumn>
        <Column>
          <InputContainer>
            <Label htmlFor="name-input">HEADING</Label>
            <Input
              required
              id="heading"
              type="text"
              name="heading"
              placeholder="someThing"
              onChange={handleChange}
            />
          </InputContainer>

          <InputContainer>
            <Label htmlFor="email-input">SUB HEADING</Label>
            <Input
              id="subHeading"
              type="text"
              name="subHeading"
              placeholder="someThing"
              onChange={handleChange}
            />
          </InputContainer>
          <InputContainer>
            <Label htmlFor="email-input">BUTTON TEXT</Label>
            <Input
              id="primaryButtonText"
              type="text"
              name="primaryButtonText"
              placeholder="someThing"
              onChange={handleChange}
            />
          </InputContainer>
          <InputContainer>
            <Label htmlFor="email-input">PHOTO</Label>
            <Input
              id="primaryButtonText"
              type="file"
              accept="image/*"
              name="primaryButtonText"
              placeholder="someThing"
              onChange={uploadImage}
            />
          </InputContainer>
        </Column>
        <Column>
          <InputContainer tw="flex-1">
            <Label htmlFor="name-input">DESCRIPTION</Label>
            <TextArea
              id="description"
              name="description"
              onChange={handleChange}
              placeholder="E.g. Details about your data"
            />
          </InputContainer>
        </Column>
      </TwoColumn>

      <SubmitButton onClick={addData}>Submit</SubmitButton>
    </div>
  );
};
