import React from "react";
import tw from "twin.macro";
import { StatData } from "AppData/StatData";
import { SectionDescription } from "components/misc/Typography";
import {
  Container as ContainerBase,
  ContentWithPaddingXl,
} from "components/misc/Layouts";
import {
  SectionHeading,
  Subheading as SubheadingBase,
} from "components/misc/Headings.js";

const HeadingContainer = tw.div``;
const StatKey = tw.div`text-xl font-medium`;
const Subheading = tw(SubheadingBase)`text-gray-100 text-center`;
const Stat = tw.div`flex flex-col text-center p-4 tracking-wide`;
const Heading = tw(SectionHeading)`sm:text-3xl md:text-4xl lg:text-5xl`;
const StatValue = tw.div`text-4xl sm:text-3xl md:text-4xl lg:text-5xl font-black`;
const Container = tw(
  ContainerBase
)`my-8 lg:my-10 bg-primary-900 text-gray-100 -mx-8 px-8`;
const Description = tw(
  SectionDescription
)`text-gray-400 text-center mx-auto max-w-screen-md`;
const StatsContainer = tw.div`mt-8 flex flex-col sm:flex-row items-center justify-center flex-wrap max-w-screen-md justify-between mx-auto`;

export default () => (
  <Container>
    <ContentWithPaddingXl>
      <HeadingContainer>
        {StatData.subheading && <Subheading>{StatData.subheading}</Subheading>}
        <Heading>{StatData.heading}</Heading>
        {StatData.description && (
          <Description>{StatData.description}</Description>
        )}
      </HeadingContainer>
      <StatsContainer>
        {StatData.stats.map((stat, index) => (
          <Stat key={index}>
            <StatValue>{stat.value}</StatValue>
            <StatKey>{stat.key}</StatKey>
          </Stat>
        ))}
      </StatsContainer>
    </ContentWithPaddingXl>
  </Container>
);
