import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51Pl79EJsvhlE6wo7snitvai6hiDMOVciIjQyIp7R0aAgVhBAcBpYorZZWLuhpfWh7w9yUudw8aXFZQFzwP4rjobY00wiJiIz6p"
);
export const Stripe = async (selectedAmount = "10") => {
  console.log("calllledddd");
  if (!selectedAmount) {
    alert("Please select an amount to proceed.");
    return;
  }
  const stripe = await stripePromise;
  await stripe.redirectToCheckout({
    //   lineItems: [
    //     {
    //       price_data: {
    //         currency: "usd",
    //         product_data: {
    //           name: `Payment of $${selectedAmount}`,
    //         },
    //         unit_amount: selectedAmount * 100, // Stripe expects the amount in cents
    //       },
    //       quantity: 1,
    //     },
    //   ],
    lineItems: [
      {
        price: "price_1QDhQdJsvhlE6wo7lCNZrtbp", // Use the Price ID for the selected amount
        quantity: 1,
      },
    ],
    mode: "payment",
    successUrl: () => {
      Email();
      window.location.origin + "/success";
    },
    cancelUrl: window.location.origin + "/cancel",
  });
};
