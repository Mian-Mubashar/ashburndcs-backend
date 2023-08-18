import AppRoutes from "Routes";
import { Container } from "helpers/Alert";

export default function App() {
  console.log("---------------------", window.localStorage.getItem("token"));

  return (
    <>
      <AppRoutes />
      <Container />

    </>
  );
}
