import React from 'react';
import './App.css';
import { Button } from "common"

function App() {
  const test = ()=>{
    console.log('test')
  }
  return (
    <div className="App">
      Usage Dashboard 
      <Button onClick={()=>{
        test()
      }}name="ok"/>/

    </div>
  );
}

export default App;
