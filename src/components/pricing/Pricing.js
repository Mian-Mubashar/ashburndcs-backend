// import React, { useState } from "react";
// import tw from "twin.macro";
// import styled from "styled-components";
// import { css } from "styled-components/macro";
// import { SectionHeading, Subheading as SubheadingBase} from "components/misc/Headings.js";
// import { SectionDescription } from "components/misc/Typography.js";
// import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
// import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
// import { ReactComponent as SvgDecoratorBlob1 } from "images/svg-decorator-blob-6.svg";
// import { ReactComponent as SvgDecoratorBlob2 } from "images/svg-decorator-blob-7.svg";
// import { useNavigate } from "react-router-dom";

// const HeaderContainer = tw.div`w-full flex flex-col items-center`;
// const Subheading = tw(SubheadingBase)`mb-4`;
// const Heading = tw(SectionHeading)`w-full`;
// const Description = tw(SectionDescription)`w-full text-center`;

// const PlanDurationSwitcher = tw.div`block w-full max-w-xs sm:inline-block sm:w-auto border-2 rounded-full px-1 py-1 mt-8`;
// const SwitchButton = styled.button`
//   ${tw`w-1/2 sm:w-32 px-4 sm:px-8 py-3 rounded-full focus:outline-none text-sm font-bold text-gray-700 transition duration-300`}
//   ${(props) => props.active && tw`bg-primary-500 text-gray-100`}
// `;

// const PlansContainer = tw.div`flex justify-center flex-col md:flex-row items-center md:items-start relative`;
// const Plan = styled.div`
//   ${tw`w-full max-w-72 mt-16 md:mr-12 md:last:mr-0 text-center px-8 rounded-lg relative text-gray-900 bg-white flex flex-col shadow-raised`}

//   ${(props) =>
//     props.featured &&
//     css`
//       ${tw`border-2 border-gray-200 shadow-none`}
//     `}
// `;

// const PlanHeader = styled.div`
//   ${tw`flex flex-col leading-relaxed py-8 -mx-8 bg-gray-100 rounded-t-lg`}
//   .name {
//     ${tw`font-bold text-xl`}
//   }
//   .price {
//     ${tw`font-bold text-4xl sm:text-5xl my-1`}
//   }
//   .slash {
//     ${tw`text-xl text-gray-500`}
//   }
//   .duration {
//     ${tw`lowercase text-gray-500 font-medium tracking-widest`}
//   }
//   .mainFeature {
//     ${tw`text-gray-500 text-sm font-medium tracking-wide`}
//   }
// `;
// const PlanFeatures = styled.div`
//   ${tw`flex flex-col -mx-8 px-8 py-8 flex-1 text-sm`}
//   .feature {
//     ${tw`mt-5 first:mt-0 font-semibold text-gray-500`}
//   }
// `;

// const PlanAction = tw.div`px-4 pb-8`;
// const BuyNowButton = styled(PrimaryButtonBase)`
//   ${tw`rounded-full tracking-wider py-4 w-full text-sm hover:shadow-xl transform hocus:translate-x-px hocus:-translate-y-px focus:shadow-outline`}
// `;

// const DecoratorBlob1 = styled(SvgDecoratorBlob1)`
//   ${tw`pointer-events-none -z-20 absolute left-0 bottom-0 h-64 w-64 opacity-25 transform -translate-x-2/3 -translate-y-1/2`}
// `;
// const DecoratorBlob2 = styled(SvgDecoratorBlob2)`
//   ${tw`pointer-events-none -z-20 absolute right-0 top-0 h-64 w-64 opacity-25 transform translate-x-2/3 translate-y-1/2 fill-current text-teal-300`}
// `;

// export default ({
//   subheading = "Pricing",
//   heading = "Flexible Plans.",
//   description = "ADCS Flexible Plans: Tailored to Your Needs. Choose from a range of customizable options, ensuring scalability, cost-efficiency, and seamless integration. Empowering your tech journey with versatility and innovation",
//   plans = null,
//   primaryButtonText = "Buy Now",
//   planDurations = [
//     {
//       text: "$",
//       switcherText: "Monthly",
//     },
//     {
//       text: "Year",
//       switcherText: "Yearly",
//     },
//   ],
// }) => {
//   const defaultPlans = [
//     {
//       name: "Basic Plan",
//       durationPrices: ["$100", "$1000"],
//       mainFeature: "Essential Support for Small Operations",
//       features: [
//         "Basic Break-Fix Services",
//         "Standard IT Support (Business Hours)",
//         "Access to Limited Training Resources",
//         "Security Patch Management",
//         "Remote Assistance",
//       ],
//     },
//     {
//       name: "Pro Plan",
//       durationPrices: ["$149", "$1499"],
//       mainFeature: "Comprehensive Solutions for Enterprise",
//       features: [
//         "Advanced Break-Fix Services with Priority Response",
//         "24/7 IT Support",
//         "Full Access to Training Library",
//         "Custom Security Solutions",
//         "On-Site Technical Assistance",
//       ],
//       featured: true,
//     },
//   ];

//   if (!plans) plans = defaultPlans;

//   const [activeDurationIndex, setActiveDurationIndex] = useState(0);
//   const navigate = useNavigate();
//   const [value, setValue] = useState({
//     basic: 1,
//     pro: 10,
//   });
//   function handleValue(e) {
//     if (e.target.name == "Pro Plan") {
//       if (e.target.value >= 10) {
//         setValue({ ...value, pro: e.target.value });
//       } else {
//         setValue({ ...value, pro: 10 });
//       }
//     } else {
//       if (e.target.value >= 1) {
//         setValue({ ...value, basic: e.target.value });
//       } else {
//         setValue(1);
//         setValue({ ...value, basic: 1 });
//       }
//     }
//   }
//   console.log({ value });
//   return (
//     <Container>
//       <ContentWithPaddingXl>
//         <HeaderContainer>
//           {subheading && <Subheading>{subheading}</Subheading>}
//           <Heading>{heading}</Heading>
//           {description && <Description>{description}</Description>}
//           <PlanDurationSwitcher>
//             {/* {planDurations.map((planDuration, index) => (
//               <SwitchButton
//                 active={activeDurationIndex === index}
//                 key={index}
//                 onClick={() => setActiveDurationIndex(index)}
//               >
//                 {planDuration.switcherText}
//               </SwitchButton>
//             ))} */}
//           </PlanDurationSwitcher>
//           {/* <h1>hello</h1>
//           <div>
//             <img src={CashApp} />
//           </div> */}
//         </HeaderContainer>
//         <PlansContainer>

//           {plans.map((plan, index) => (
//             <Plan key={index} featured={plan.featured}>
//               <PlanHeader>
//                 <span className="priceAndDuration">
//                   <input
//                     className="price"
//                     // value={plan.durationPrices[activeDurationIndex]}
//                     value={plan.name == "Pro Plan" ? value.pro : value.basic}
//                     type="number"
//                     name={plan.name}
//                     min={plan.name == "Pro Plan" ? 10 : 1}
//                     max={1000}
//                     onChange={handleValue}
//                     onWheel={(event) => event.currentTarget.blur()}
//                     style={{
//                       width: "150px",
//                       border: "none",
//                       borderRadius: "20px",
//                       WebkitAppearance: "none", // Disables spin buttons in Chrome
//                       appearance: "textfield", // Ensures consistent appearance across browsers
//                       margin: 0,
//                     }}
//                   />
//                   {/* {plan.durationPrices[activeDurationIndex]} */}
//                   {/* </input> */}
//                   <span className="slash"> / </span>
//                   <span className="duration">
//                     {planDurations[activeDurationIndex].text}
//                   </span>
//                 </span>
//                 <span className="name">{plan.name}</span>
//                 <span className="mainFeature">{plan.mainFeature}</span>
//               </PlanHeader>
//               <PlanFeatures>
//                 {plan.features.map((feature, index) => (
//                   <span key={index} className="feature">
//                     {feature}
//                   </span>
//                 ))}
//               </PlanFeatures>
//               <PlanAction>
//                 <BuyNowButton
//                   onClick={() =>
//                     navigate("/payment", {
//                       state: {
//                         plan: plan.name,
//                         amount:
//                           plan.name == "Pro Plan" ? value.pro : value.basic,
//                       },
//                     })
//                   }
//                 >
//                   {primaryButtonText}
//                 </BuyNowButton>
//               </PlanAction>
//             </Plan>
//           ))}
//         </PlansContainer>
//       </ContentWithPaddingXl>
//       <DecoratorBlob1 />
//       <DecoratorBlob2 />
//     </Container>
//   );
// };


import React, { useState } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro";
import { SectionHeading, Subheading as SubheadingBase } from "components/misc/Headings.js";
import { SectionDescription } from "components/misc/Typography.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { ReactComponent as SvgDecoratorBlob1 } from "images/svg-decorator-blob-6.svg";
import { ReactComponent as SvgDecoratorBlob2 } from "images/svg-decorator-blob-7.svg";
import CashAppImage from "images/Cash_App.png";
import ZelleImage from "images/Zelle.png";
import { useNavigate } from "react-router-dom";

const HeaderContainer = tw.div`w-full flex flex-col items-center`;
const Subheading = tw(SubheadingBase)`mb-4`;
const Heading = tw(SectionHeading)`w-full`;
const Description = tw(SectionDescription)`w-full text-center`;

const PlanDurationSwitcher = tw.div`block w-full max-w-xs sm:inline-block sm:w-auto border-2 rounded-full px-1 py-1 mt-8`;
const SwitchButton = styled.button`
  ${tw`w-1/2 sm:w-32 px-4 sm:px-8 py-3 rounded-full focus:outline-none text-sm font-bold text-gray-700 transition duration-300`}
  ${(props) => props.active && tw`bg-primary-500 text-gray-100`}
`;

const PlansContainer = tw.div`flex justify-center flex-col md:flex-row items-center md:items-start relative`;
const Plan = styled.div`
  ${tw`w-full max-w-72 mt-16 md:mr-12 md:last:mr-0 text-center px-8 rounded-lg relative text-gray-900 bg-white flex flex-col shadow-raised`}

  ${(props) =>
    props.featured &&
    css`
      ${tw`border-2 border-gray-200 shadow-none`}
    `}
`;

const PlanHeader = styled.div`
  ${tw`flex flex-col leading-relaxed py-8 -mx-8 bg-gray-100 rounded-t-lg`}
  .name {
    ${tw`font-bold text-xl`}
  }
  .price {
    ${tw`font-bold text-4xl sm:text-5xl my-1`}
  }
  .slash {
    ${tw`text-xl text-gray-500`}
  }
  .duration {
    ${tw`lowercase text-gray-500 font-medium tracking-widest`}
  }
  .mainFeature {
    ${tw`text-gray-500 text-sm font-medium tracking-wide`}
  }
`;
const PlanFeatures = styled.div`
  ${tw`flex flex-col -mx-8 px-8 py-8 flex-1 text-sm`}
  .feature {
    ${tw`mt-5 first:mt-0 font-semibold text-gray-500`}
  }
`;

const PlanAction = tw.div`px-4 pb-8`;
const BuyNowButton = styled(PrimaryButtonBase)`
  ${tw`rounded-full tracking-wider py-4 w-full text-sm hover:shadow-xl transform hocus:translate-x-px hocus:-translate-y-px focus:shadow-outline`}
`;

const DecoratorBlob1 = styled(SvgDecoratorBlob1)`
  ${tw`pointer-events-none -z-20 absolute left-0 bottom-0 h-64 w-64 opacity-25 transform -translate-x-2/3 -translate-y-1/2`}
`;
const DecoratorBlob2 = styled(SvgDecoratorBlob2)`
  ${tw`pointer-events-none -z-20 absolute right-0 top-0 h-64 w-64 opacity-25 transform translate-x-2/3 translate-y-1/2 fill-current text-teal-300`}
`;

export default ({
  subheading = "Pricing",
  heading = "Flexible Payment.",
  description = "ADCS provides innovative and versatile solutions tailored to your needs, ensuring seamless integration and efficiency. Payments can be securely made via Zelle, Cash App, or bank transfer, offering flexibility and convenience.",
  plans = null,
  primaryButtonText = "Buy Now",
  planDurations = [
    {
      text: "$",
      switcherText: "Monthly",
    },
    {
      text: "Year",
      switcherText: "Yearly",
    },
  ],
}) => {
  const defaultPlans = [
    {
      name: "Basic Payment",
      durationPrices: ["$100", "$1000"],
      mainFeature: "Essential Support for Small Operations",
      features: [
        "Less then $3000",
        "Basic Break-Fix Services",
        "Standard IT Support (Business Hours)",
        "Access to Limited Training Resources",
        "Security Patch Management",
        "Remote Assistance",
      ],
    },
    {
      name: "Pro Payment",
      durationPrices: ["$149", "$1499"],
      mainFeature: "Comprehensive Solutions for Enterprise",
      features: [
        "Less Then $10,000",
        "Advanced Break-Fix Services with Priority Response",
        "24/7 IT Support",
        "Full Access to Training Library",
        "Custom Security Solutions",
        "On-Site Technical Assistance",
      ],
      featured: true,
    },
  ];

  if (!plans) plans = defaultPlans;

  const [activeDurationIndex, setActiveDurationIndex] = useState(0);
  const navigate = useNavigate();
  const [value, setValue] = useState({
    basic: 1,
    pro: 10,
  });
  function handleValue(e) {
    if (e.target.name === "Pro Plan") {
      setValue({ ...value, pro: Math.max(e.target.value, 10) });
    } else {
      setValue({ ...value, basic: Math.max(e.target.value, 1) });
    }
  }
  return (
    <Container>
      <ContentWithPaddingXl>
        <HeaderContainer>
          {subheading && <Subheading>{subheading}</Subheading>}
          <Heading>{heading}</Heading>
          {description && <Description>{description}</Description>}
          <div tw="flex justify-center mt-6 space-x-40">
            <div>
            <img src={CashAppImage} alt="Cash App" tw="w-40 h-auto border-black border-2" />
            <h3 tw="text-gray-600 mt-2">Send Money with <b tw="text-green-500 text-xl" > CashApp</b></h3>
            <p>Scan To Pay <b tw="text-blue-900 text-lg" >$ADCS</b></p>
            </div>
            <div>
            <img src={ZelleImage} alt="Zelle" tw="w-40 h-auto border-black border-2"/>
            <h3 tw="text-gray-600 mt-2" >Send Money with <b tw="text-purple-900 text-xl" > Zelle</b></h3>
            <p>Scan To Pay <b tw="text-blue-900 text-lg" >$ADCS</b></p>
            </div>
          </div>
        </HeaderContainer>
        <PlansContainer>
          {plans.map((plan, index) => (
            <Plan key={index} featured={plan.featured}>
              <PlanHeader>
                <span className="priceAndDuration">
                  <input
                    className="price"
                    value={plan.name === "Pro Plan" ? value.pro : value.basic}
                    type="number"
                    name={plan.name}
                    min={plan.name === "Pro Plan" ? 10 : 1}
                    max={1000}
                    onChange={handleValue}
                    onWheel={(event) => event.currentTarget.blur()}
                    style={{
                      width: "150px",
                      border: "none",
                      borderRadius: "20px",
                      WebkitAppearance: "none",
                      appearance: "textfield",
                      margin: 0,
                    }}
                  />
                  <span className="slash"> / </span>
                  <span className="duration">
                    {planDurations[activeDurationIndex].text}
                  </span>
                </span>
                <span className="name">{plan.name}</span>
                <span className="mainFeature">{plan.mainFeature}</span>
              </PlanHeader>
              <PlanFeatures>
                {plan.features.map((feature, index) => (
                  <span key={index} className="feature">
                    {feature}
                  </span>
                ))}
              </PlanFeatures>
              <PlanAction>
                <BuyNowButton
                  onClick={() =>
                    navigate("/payment", {
                      state: {
                        plan: plan.name,
                        amount:
                          plan.name === "Pro Plan" ? value.pro : value.basic,
                      },
                    })
                  }
                >
                  {primaryButtonText}
                </BuyNowButton>
              </PlanAction>
            </Plan>
          ))}
        </PlansContainer>
      </ContentWithPaddingXl>
      <DecoratorBlob1 />
      <DecoratorBlob2 />
    </Container>
  );
};
