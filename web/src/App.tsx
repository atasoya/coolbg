import Hero from "./components/Hero";
import Editor from "./components/editor/Editor";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="flex flex-col items-center justify-center px-4 font-nunito">
      <Hero />
      <Editor />
      <Footer />
    </div>
  );
}

export default App;
