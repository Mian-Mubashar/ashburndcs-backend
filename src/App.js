import AppRoutes from "Routes";
import { Container } from "helpers/Alert";
import emailjs from "@emailjs/browser";

export default function App() {
  console.log("---------------------", window.localStorage.getItem("token"));

  return (
    <>
      <AppRoutes />
      <Container />
    </>
  );
}
