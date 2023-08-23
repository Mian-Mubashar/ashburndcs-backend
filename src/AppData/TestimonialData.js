import tw from "twin.macro";
import loveIllustrationImageSrc from "images/love-illustration.svg";

const HighlightedText = tw.span`text-primary-500`;

export const TestimonialData = {
  heading: (
    <>
      Our Clients <HighlightedText>Love Us</HighlightedText>
    </>
  ),
  description:
    "Ashburn Tech proudly serves a diverse clientele spanning startups, enterprises, tech innovators, and academic institutions. Our esteemed clients benefit from our cutting-edge services, fostering growth, innovation, and technological advancement.",
  testimonials: [
    {
      stars: 5,
      profileImageSrc:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3.25&w=512&h=512&q=80",
      heading: "Amazing User Experience",
      quote:
        "Ashburn Tech has revolutionized our operations. Their seamless networking solutions and top-tier cybersecurity have elevated our productivity and peace of mind",
      customerName: "Tech Innovations Inc",
      customerTitle: "CEO.",
    },
    {
      stars: 5,
      profileImageSrc:
        "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=512&h=512&q=80",
      heading: "Love the Developer Experience and Design Principles !",
      quote:
        "Ashburn Tech's platform accelerated our growth. Their web development and SEO expertise boosted our online presence, attracting investors and customers",
      customerName: "StartupX Ventures",
      customerTitle: "Founder",
    },
  ],
  imageSrc : loveIllustrationImageSrc,
  imageRounded : true,
  imageBorder : false,
  imageShadow : false,
  subheading : "Testimonials",
  textOnLeft : false,
};
