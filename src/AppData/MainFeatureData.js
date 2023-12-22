import tw from "twin.macro";
import FastIconImage from "images/fast-icon.svg";
import ShieldIconImage from "images/shield-icon.svg";
import SimpleIconImage from "images/simple-icon.svg";
import SupportIconImage from "images/support-icon.svg";
import ReliableIconImage from "images/reliable-icon.svg";
import CustomizeIconImage from "images/customize-icon.svg";
import serverSecureIllustrationImageSrc from "images/server-secure-illustration.svg";
import serverRedundancyIllustrationImageSrc from "images/server-redundancy-illustration.svg";
import education from "images/demo/3974536.jpg";

const HighlightedText = tw.span`text-primary-500`;

export const FeatureCardsData = [
  {
    imageSrc: ShieldIconImage,
    title: "High-Speed Connectivity",
    description:
      "ADCS Tech offers lightning-fast internet speeds, ensuring seamless data transfer and reduced latency for optimal performance",
  },
  {
    imageSrc: SupportIconImage,
    title: "State-of-the-Art Facilities",
    description:
      "With modern, purpose-built facilities, ADCS Tech provides an ideal environment for tech-driven enterprises to thrive and innovate.",
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
    heading: "Resolving Issues for Seamless Operations",
    subheading: "Data Center Troubleshooting",
    imageSrc: serverRedundancyIllustrationImageSrc,
    primaryButtonText: "More Info",
    textOnLeft: true,
    description:
      "Experience uninterrupted data center performance with Ashburn's expert troubleshooting services. Our skilled technicians diagnose, identify, and swiftly resolve issues, ensuring minimal downtime and optimal efficiency. From hardware glitches to network complexities, we've got you covered, keeping your critical infrastructure running smoothly. Trust us to navigate the intricacies of your data center, providing rapid solutions and proactive insights to prevent future disruptions. Your data center's reliability is our priority.",
  },
  {
    heading: "Services",
    subheading: "Solution",
    imageSrc: serverSecureIllustrationImageSrc,
    primaryButtonText: "More Info",
    textOnLeft: false,
    description:
      "ADCS Tech offers comprehensive services including SEO optimization, website design and development, and advanced networking solutions. Catering to diverse digital needs, it empowers businesses with effective online presence, seamless connectivity, and strategic growth strategies, ensuring success in today's competitive landscape.",
  },
  {
    heading: "Courses",
    subheading: "E-learning",
    imageSrc: education,
    primaryButtonText: "More Info",
    textOnLeft: true,
    description:
      "ADCS Tech offers comprehensive services including SEO optimization, website design and development, and advanced networking solutions. Catering to diverse digital needs, it empowers businesses with effective online presence, seamless connectivity, and strategic growth strategies, ensuring success in today's competitive landscape.",
  },

  // {
  //   heading: (
  //     <>
  //       Ashburn built by and for
  //       <HighlightedText> Professionals </HighlightedText>
  //     </>
  //   ),
  //   description:
  //     "Ashburn Tech: Expertly Designed by and for Professionals. A purpose-driven ecosystem, tailored to empower industry leaders, startups, and experts, fostering collaboration, innovation, and success",
  // },
];

export const FeatureData = [
  {
    heading: (
      <>
        ADCS <HighlightedText>L1 (Level 1) Tech Support</HighlightedText>
      </>
    ),
    subheading: "Features",
    description:
      "At ADCS, we pride ourselves on delivering top-notch tech support services to ensure a seamless experience for our customers. Our tech support is organized into three distinct levels, each playing a crucial role in addressing and resolving your technical issues.",
  },
];
export const FeatureCardsDataL1 = [
  
  {
    imageSrc: ReliableIconImage,
    title: "First Line of Assistance",
    description:
      "Our L1 support team is your initial point of contact, ready to address and resolve your basic technical inquiries",
  },
  {
    imageSrc: FastIconImage,
    title: "Swift Issue Resolution",
    description:
      "We excel in quick problem diagnosis and offer solutions for common technical challenges",
  },
  {
    imageSrc: SimpleIconImage,
    title: "Escalation Process",
    description:
      "For more complex issues, our L1 team efficiently escalates problems to higher tiers for in-depth resolution",
  },
];
export const FeatureCardsDataL2 = [
  
  {
    imageSrc: ReliableIconImage,
    title: "Advanced Troubleshooting",
    description:
      "Our L2 support specialists are experts in handling more intricate technical problems that may require a deeper understanding",
  },
  {
    imageSrc: FastIconImage,
    title: "Specialized Assistance",
    description:
      "From networking issues to software glitches, our L2 team provides specialized solutions to ensure your systems run smoothly",
  },
  {
    imageSrc: SimpleIconImage,
    title: "Collaborative Approach",
    description:
      " Working closely with other departments, L2 support ensures comprehensive issue resolution and continuous improvement",
  },
];
export const FeatureCardsDataL3 = [
  
  {
    imageSrc: ReliableIconImage,
    title: "Highest Expertise",
    description:
      "Our L3 support is the pinnacle of technical expertise, tackling the most challenging and critical issues with precision",
  },
  {
    imageSrc: FastIconImage,
    title: "Strategic Solutions",
    description:
      "L3 specialists collaborate with product development teams to address underlying software and hardware challenges",
  },
  {
    imageSrc: SimpleIconImage,
    title: "Guidance and Training",
    description:
      "Providing guidance to lower support tiers, L3 ensures the continuous improvement of our support services",
  },
];