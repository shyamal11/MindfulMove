import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Testimonials from '../UI/Testimonials';
import Pricing from '../UI/Pricing';
import Home from '../UI/Home';
import { AuthContext } from './AuthContextProvider';
import Login from '../UI/LogIn/Login';
import Questionnaire from './Questionnaires';
import ReportTracker from './ReportTracker'
import AllYoga from './AllYoga'
import LiveYoga from './LiveYoga';
import PopUp from './PopUp';
import Gad from './Gad';
import Phq9 from './Phq9'
import SuggestYoga from './SuggestYoga'


const AllRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/programs" element={<Testimonials />} />
      <Route path="/membership" element={<Pricing />} />
      <Route path="/questionnaires" element={<Questionnaire />} />
      <Route path="/all-yoga" element={<AllYoga />} />
      <Route path="/live-yoga" element={<LiveYoga />} />
      <Route path="/pop-up" element={<PopUp />} />
      <Route path="/gad7" element={<Gad />} />
      <Route path="/phq9" element={<Phq9 />} />
      <Route path="/suggested-yoga" element={<SuggestYoga />} />
      <Route path="*" element={<div>Page Not Found</div>} />
      <Route
        path="/track"
        element={user ? <ReportTracker /> : <Login />}
      />
    </Routes>
  );
};

export default AllRoutes;
