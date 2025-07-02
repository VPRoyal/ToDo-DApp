// src/App.tsx
import Home from "./pages/Home";
// import { useWeb3 } from '../hooksOld/useWeb3';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Home/>
    </div>
  );
};

export default App;