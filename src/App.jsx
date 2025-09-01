import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import CurrencyConverter from './CurrencyConverter';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CurrencyConverter />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
