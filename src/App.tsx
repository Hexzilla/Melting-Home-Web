import Providers from './Providers';
import Header from './components/layout/Header';
import Home from './pages/Home';

import './App.css';
import '@solana/wallet-adapter-react-ui/styles.css';

function App() {
  return (
    <Providers>
      <Header />
      <Home />
    </Providers>
  );
}

export default App;
