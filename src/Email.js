export const Email = (e) => {
  e.preventDefault();

  // Define the template parameters as an object
  const templateParams = {
    user_name: "James",
    user_email: "abdulbasit99786+wahwah@gmail.com",
    message: "Email Sent Kindly confirm",
  };

  emailjs
    .send(
      "service_0qmutp5", // Service ID
      "template_00f8hcl", // Template ID
      templateParams, // Template parameters
      "Tu_JcFhNhrSGZDnp2" // Public key (or User ID)
    )
    .then(
      () => {
        console.log("SUCCESS!");
        alert("Sent Email");
      },
      (error) => {
        alert("Failed");
        console.log("FAILED...", error.text);
      }
    );
};
