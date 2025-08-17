import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GenerateOrRedirectNote from './components/GenerateOrRedirectNote';
import NoteEditor from './components/NoteEditor';
import Header from './components/header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
    <div className="bg-base-300 h-full w-full lg:p-12 p-0 ">
      <div className="">
      
      <Header />
      <Routes>
        <Route path="/" element={<GenerateOrRedirectNote />} />
        <Route path="/:noteId" element={<NoteEditor />} />
      </Routes>
      <Footer />
      </div>
    </div>
    </Router>
  );
}

export default App;
