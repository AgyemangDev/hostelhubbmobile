// context/ProductsContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as productsData } from './../assets/data/productData';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // For now, we just load the static products data
    setProducts(productsData);
  }, []);

  return (
    <ProductsContext.Provider value={{ products }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
