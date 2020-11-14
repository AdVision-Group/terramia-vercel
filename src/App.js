import React from 'react';

import Router from "./app/Router";

export default function App() {

  if (!localStorage.getItem("cart")) { 
    localStorage.setItem("cart", JSON.stringify([]))
  }

  return (
    <Router />
  );
}