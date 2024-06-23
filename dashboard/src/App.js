import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainBOX from './components/dashboard/Main.js'
function App() {
  

  return (<>
    
    <Router>
      <Routes>
        <Route path="/" element={<MainBOX />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
