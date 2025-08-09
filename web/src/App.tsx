import Hero from "./components/Hero";
import Editor from "./components/editor/Editor";

function App() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Hero />
      <Editor />
    </div>
  );
}

export default App;
