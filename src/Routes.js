import React from "react";
import LoginPage from "pages/Login.js";
import SignupPage from "pages/Signup.js";
import PricingPage from "pages/Pricing.js";
import AboutUsPage from "pages/AboutUs.js";
import ThankYouPage from "ThankYouPage.js";
import DataTable from "pages/DataEdit";
import ELearning from "pages/E-learning";
import OurServices from "pages/OurServices";
import ContactUsPage from "pages/ContactUs.js";
import BlogIndexPage from "pages/BlogIndex.js";
import GlobalStyles from "styles/GlobalStyles";
import AdminLogin from "AdminSide/login";
import MainLandingPage from "MainLandingPage.js";
import PrivacyPolicyPage from "pages/PrivacyPolicy.js";
import TermsOfServicePage from "pages/TermsOfService.js";
import WebDevelopment from "DetailPage/WebDevelopment";
import NotFound from "components/myComponent/NotFound";
import AdminDashboard from "AdminSide/dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DataUploadFrom from "components/forms/DataUploadFrom";
export default function AppRoutes() {
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
          <Route path="/e-learning" element={<ELearning />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/services" element={<OurServices />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/services/:id" element={<WebDevelopment />} />
          <Route path="/E-learning/:id" element={<WebDevelopment />} />
          <Route path="*" element={<NotFound />} />

          {/* admin Routes? */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/new-data" element={<DataUploadFrom />} />
          <Route path="/check-data" element={<DataTable />} />
          <Route path="/edit-data/:id" element={<DataUploadFrom />} />
          <Route
            path="/success"
            element={
              <>
                <h1>Payment Successful</h1>
                <button onClick={() => (window.location.href = "/")}>
                  Move to Dashboard
                </button>
              </>
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
