import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import '../src/Styles/Global.css';

function App() {
  return (
    <div className="App">
      <div className="navbar">
        <Navbar/>
      </div>
      <div className="homepage">
        <HomePage/>
      </div>
    </div>
  );
}

export default App;
