import React from "react";
import LoginPage from "pages/Login.js";
import SignupPage from "pages/Signup.js";
import PricingPage from "pages/Pricing.js";
import AboutUsPage from "pages/AboutUs.js";
import ThankYouPage from "ThankYouPage.js";
// import DataTable from "pages/DataEdit";
// import AdminLogin from "AdminSide/login";
// import AdminDashboard from "AdminSide/dashboard";
// import DataUploadFrom from "components/forms/DataUploadFrom";
import ELearning from "pages/E-learning";
import OurServices from "pages/OurServices";
import ContactUsPage from "pages/ContactUs.js";
import BlogIndexPage from "pages/BlogIndex.js";
import GlobalStyles from "styles/GlobalStyles";
import MainLandingPage from "MainLandingPage.js";
import PrivacyPolicyPage from "pages/PrivacyPolicy.js";
import TermsOfServicePage from "pages/TermsOfService.js";
import WebDevelopment from "DetailPage/WebDevelopment";
import NotFound from "components/myComponent/NotFound";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Email } from "Email";
import { Stripee } from "components/stripe";
import ThankYou from "components/myComponent/Thanks";
import DataCenter from "pages/DataCenter";
export default function AppRoutes() {
  return (
    <>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<MainLandingPage />} />
          <Route path="/buy-now" element={<PricingPage />} />
          <Route path="/blog" element={<BlogIndexPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/e-learning" element={<ELearning />} />
          <Route path="/d-services" element={<DataCenter />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/services" element={<OurServices />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/services/:id" element={<WebDevelopment />} />
          <Route path="/d-services/:id" element={<WebDevelopment />} />
          <Route path="/E-learning/:id" element={<WebDevelopment />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/Payment" element={<Stripee />} />
          <Route path="/Thanks" element={<ThankYou />} />

          {/* admin Routes? */}
          {/* <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/new-data" element={<DataUploadFrom />} />
          <Route path="/check-data" element={<DataTable />} />
          <Route path="/edit-data/:id" element={<DataUploadFrom />} /> */}
          <Route
            path="/success"
            element={
              <div onLoad={() => Email()}>
                <h1>Payment Successful</h1>
                <button onClick={() => (window.location.href = "/")}>
                  Move to Dashboard
                </button>
              </div>
            }
          />
          <Route
            path="/cancel"
            element={
              <>
                <h1>Payment Cancel</h1>
                <button onClick={() => (window.location.href = "/")}>
                  Move to Dashboard
                </button>
              </>
            }
          />
        </Routes>
      </Router>
    </>
  );
}
