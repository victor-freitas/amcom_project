import React, { useState } from 'react';
import ToolbarComponent from './components/Toolbar';
import Comission from './components/Comission';
import NewSale from './components/NewSales';
import SalesList from './components/SalesListPage';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {
  const [selectedMenuItem, setSelectedMenuItem] = useState('Vendas');

  return (
    <Router>
      <div>
        <ToolbarComponent setSelectedMenuItem={setSelectedMenuItem} />
        <Routes>
          <Route path="/list-sales" element={<SalesList />} />
          <Route path="/new-sale" element={<NewSale />} />
          <Route path="/comission" element={<Comission />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/edit-sale/:saleId" element={<NewSale editMode />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;