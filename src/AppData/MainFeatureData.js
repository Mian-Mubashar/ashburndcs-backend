import tw from "twin.macro";
import FastIconImage from "images/fast-icon.svg";
import ShieldIconImage from "images/shield-icon.svg";
import SimpleIconImage from "images/simple-icon.svg";
import SupportIconImage from "images/support-icon.svg";
import ReliableIconImage from "images/reliable-icon.svg";
import CustomizeIconImage from "images/customize-icon.svg";
import serverSecureIllustrationImageSrc from "images/server-secure-illustration.svg";
import serverRedundancyIllustrationImageSrc from "images/server-redundancy-illustration.svg";

const HighlightedText = tw.span`text-primary-500`;

export const FeatureCardsData = [
  {
    imageSrc: ShieldIconImage,
    title: "High-Speed Connectivity",
    description:
      "Ashburn Tech offers lightning-fast internet speeds, ensuring seamless data transfer and reduced latency for optimal performance",
  },
  {
    imageSrc: SupportIconImage,
    title: "State-of-the-Art Facilities",
    description:
      "With modern, purpose-built facilities, Ashburn Tech provides an ideal environment for tech-driven enterprises to thrive and innovate.",
  },
  {
    imageSrc: CustomizeIconImage,
    title: "Robust Security",
    description:
      "Top-notch cybersecurity measures safeguard valuable data, guaranteeing a secure environment for sensitive operations and confidential information.",
  },
  {
    imageSrc: ReliableIconImage,
    title: "Collaborative Ecosystem",
    description:
      "A dynamic tech community encourages networking, knowledge-sharing, and synergistic partnerships, fueling creativity and growth",
  },
  {
    imageSrc: FastIconImage,
    title: "Scalability and Flexibility",
    description:
      "Adaptable spaces and scalable resources accommodate evolving business needs, enabling companies to expand and succeed without constraints.",
  },
  {
    imageSrc: SimpleIconImage,
    title: "Access to Expertise",
    description:
      "Proximity to tech experts, thought leaders, and educational institutions offers a rich pool of knowledge and talent, fostering continuous learning and development.",
  },
];

export const MainFeatureData = [
  {
    heading: "Services",
    subheading: "Solution",
    imageSrc: serverRedundancyIllustrationImageSrc,
    primaryButtonText: "More Info",
    textOnLeft: true,
    description:
      "Ashburn Tech offers comprehensive services including SEO optimization, website design and development, and advanced networking solutions. Catering to diverse digital needs, it empowers businesses with effective online presence, seamless connectivity, and strategic growth strategies, ensuring success in today's competitive landscape.",
  },
  {
    heading: "Courses",
    subheading: "E-learning",
    imageSrc: serverSecureIllustrationImageSrc,
    primaryButtonText: "More Info",
    textOnLeft: false,
    description:
      "Ashburn Tech offers comprehensive services including SEO optimization, website design and development, and advanced networking solutions. Catering to diverse digital needs, it empowers businesses with effective online presence, seamless connectivity, and strategic growth strategies, ensuring success in today's competitive landscape.",
  },
  {
    heading: (
      <>
        Ashburn built by and for
        <HighlightedText> Professionals </HighlightedText>
      </>
    ),
    description:
      "Ashburn Tech: Expertly Designed by and for Professionals. A purpose-driven ecosystem, tailored to empower industry leaders, startups, and experts, fostering collaboration, innovation, and success",
  },
];

export const FeatureData = [
  {
    heading: (
      <>
        Ashburn <HighlightedText>Features</HighlightedText>
      </>
    ),
    subheading: "Features",
    description:
      "Ashburn Tech boasts ultra-fast connectivity, cutting-edge infrastructure, and a vibrant tech community, fostering innovation and collaboration for unparalleled success in the digital age.",
  },
];


