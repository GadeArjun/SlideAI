import "./App.css";
import ClosingTester from "./components/ClosingTester";
import ContentTester from "./components/ContentTester";
import FullDeckTester from "./components/FullDeskTester";
import HeroTester from "./components/HeroTester";

function App() {
  return (
    <>
      <FullDeckTester />
      <HeroTester />
      <ContentTester />
      <ClosingTester />
    </>
  );
}

export default App;
