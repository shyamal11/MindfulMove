import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Testimonials from '../UI/Testimonials';
import Pricing from '../UI/Pricing';
import Home from '../UI/Home';
import { AuthContext } from './AuthContextProvider';
import Login from '../UI/LogIn/Login';
import Questionnaire from './Questionnaires';
import ReportTracker from './ReportTracker'
import Yoga from './Yoga'
import LiveYoga from './LiveYoga';


const AllRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/programs" element={<Testimonials />} />
      <Route path="/membership" element={<Pricing />} />
      <Route path="/questionnaires" element={<Questionnaire />} />
      <Route path="/yoga" element={<Yoga />} />
      <Route path="/live-yoga" element={<LiveYoga />} />
      <Route path="*" element={<div>Page Not Found</div>} />
      <Route
        path="/track"
        element={user ? <ReportTracker /> : <Login />}
      />
    </Routes>
  );
};

export default AllRoutes;
