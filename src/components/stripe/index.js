import React, { useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import tw from "twin.macro";

import styled from "styled-components";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";

import "./style.css"; // Custom CSS file for styling
import { useLocation, useNavigate } from "react-router-dom";
import { Toast } from "helpers/Alert";
import { Email } from "Email";
const BuyNowButton = styled(PrimaryButtonBase)`
  ${tw`rounded-full tracking-wider py-4 w-full text-sm hover:shadow-xl transform hocus:translate-x-px hocus:-translate-y-px focus:shadow-outline`}
`;
export const Stripee = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");
  const Token = window.localStorage.getItem("token");
  useEffect(() => {
    console.log({ Token });
  }, [Token]);
  useEffect(() => {
    if (!Token) {
      navigate("/");
      Toast({
        message: "Kindly Login first to perform transaction",
        type: "info",
      });
    } else {
      fetch(`${process.env.REACT_APP_BACKEND_URL}create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: state.amount,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log({ data });
          setClientSecret(data.clientSecret);
        });
    }
  }, [Token]);
  console.log({ clientSecret });
  return (
    <>{Token && <PaymentForm clientSecret={clientSecret} state={state} />}</>
  );
};
const PaymentForm = ({ clientSecret, state }) => {
  const stripe = useStripe();
  const navigate = useNavigate();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      setIsLoading(false);
      return; // Stripe.js has not yet loaded.
    }

    const cardElement = elements.getElement(CardElement);
    const { paymentIntent, error } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: "Customer Name", // Replace with customer data
          },
        },
      }
    );

    if (error) {
      setPaymentStatus(`❌ Payment failed: ${error.message}`);
      Toast({ message: `❌ Payment failed: ${error.message}`, type: "error" });
    } else if (paymentIntent.status === "succeeded") {
      navigate("/thanks");
      Toast({ message: "✅ Payment succeeded!" });

      setPaymentStatus("✅ Payment succeeded!");
      Email(paymentIntent);
    }

    setIsLoading(false);
  };

  return (
    <>
   
      <div class="intimation-note">
        <h2>Thank You for Choosing the {state.plan}!</h2>
        <p>
          You are about to make a payment of <strong>${state.amount}</strong>{" "}
          for the <strong>{state.plan}</strong>. Please ensure the following
          before proceeding:
        </p>
        <ul>
          <li>
            <strong>Card Details:</strong> Enter accurate and valid card
            information to avoid delays.
          </li>
          <li>
            <strong>Security:</strong> Your payment is securely processed using
            industry-standard encryption via Stripe.
          </li>
          <li>
            <strong>Confirmation:</strong> Once your payment is successfully
            completed, you will receive an email confirmation along with access
            to all features of the Basic Plan.
          </li>
        </ul>
        <p>
          If you face any issues, please contact our support team at{" "}
          <a href="ashburndcsolutions@gmail.com">
            ashburndcsolutions@gmail.com
          </a>
          .
        </p>
        <p>
          <strong>Click "Pay" to complete your transaction.</strong>
        </p>

        <div className="payment-form-container">
          <form onSubmit={handleSubmit} className="payment-form">
            <div className="card-element-wrapper">
              <CardElement className="card-element" />
            </div>

            <BuyNowButton disabled={!stripe || isLoading}>
              {isLoading ? "Processing..." : "Pay"}
            </BuyNowButton>
            {paymentStatus && (
              <div className="payment-status">{paymentStatus}</div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default PaymentForm;
