import React from "react";
import LoginPage from "pages/Login.js";
import SignupPage from "pages/Signup.js";
import PricingPage from "pages/Pricing.js";
import AboutUsPage from "pages/AboutUs.js";
import ThankYouPage from "ThankYouPage.js";
import OurServices from "pages/OurServices";
import ContactUsPage from "pages/ContactUs.js";
import BlogIndexPage from "pages/BlogIndex.js";
import GlobalStyles from "styles/GlobalStyles";
import MainLandingPage from "MainLandingPage.js";
import PrivacyPolicyPage from "pages/PrivacyPolicy.js";
import TermsOfServicePage from "pages/TermsOfService.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WebDevelopment from "DetailPage/WebDevelopment";
import ELearning from "pages/E-learning";
export default function AppRoutes() {
  // If you want to disable the animation just use the disabled `prop` like below on your page's component
  // return <AnimationRevealPage disabled>xxxxxxxxxx</AnimationRevealPage>;
  return (
    <>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<MainLandingPage />} />
          <Route path="/price" element={<PricingPage />} />
          <Route path="/blog" element={<BlogIndexPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/services" element={<OurServices />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/web" element={<WebDevelopment />} />
          <Route path="/e-learning" element={<ELearning />} />


        </Routes>
      </Router>
    </>
  );
}
