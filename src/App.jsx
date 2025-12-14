import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ShoppingListProvider } from './providers/ShoppingListProvider';
import ShoppingListsOverview from './components/ShoppingListsOverview';
import ShoppingListDetail from './components/ShoppingListDetail';

function App() {
  return (
    <ShoppingListProvider>
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route path="/" element={<ShoppingListsOverview />} />
            <Route path="/lists/:listId" element={<ShoppingListDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ShoppingListProvider>
  );
}

export default App;

