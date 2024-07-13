import { Suspense, lazy, useContext } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";

// layouts
import { Navbar, MobileNavbar, Footer } from "./layouts";

// microInteraction
import { Loading, Alert } from "./microInteraction";

// modals
import { EventModal } from "./features";

// state
import AuthContext from "./context/AuthContext";

// Lazy loading pages
const Home = lazy(() => import("./pages/Home/Home"));
const Event = lazy(() => import("./pages/Event/Event"));
const PastEvent = lazy(() => import("./pages/Event/PastEvent"));
const EventForm = lazy(() => import("./pages/Event/EventForm"));
const Social = lazy(() => import("./pages/Social/Social"));
const Team = lazy(() => import("./pages/Team/Team"));
const Alumni = lazy(() => import("./pages/Alumni/Alumni"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const Login = lazy(() => import("./pages/Authentication/Login/Login"));
const Signup = lazy(() => import("./pages/Authentication/Signup/Signup"));
const ForgotPassword = lazy(() =>
  import("./pages/Authentication/ForgotPassword/ForgotPassword")
);
const Error = lazy(() => import("./pages/Error/Error"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions/T&C"));

const MainLayout = () => (
  <div>
    <Navbar />
    <MobileNavbar />
    <div className="page">
      <Outlet />
    </div>
    <Footer />
  </div>
);

const AuthLayout = () => (
  <div className="page">
    <Outlet />
  </div>
);

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/Events" element={<Event />} />
            <Route path="/Events/pastEvents" element={<PastEvent />} />
            <Route path="/Social" element={<Social />} />
            <Route path="/Team" element={<Team />} />
            <Route path="/Alumni" element={<Alumni />} />
            {authCtx.isLoggedIn && [
              <Route path="/profile" element={<Profile />} />,
              <Route
                path="/profile/Events/:eventId"
                element={[<Profile />, <EventModal onClosePath="/profile" />]}
              />,
            ]}
            <Route
              path="/Events/:eventId"
              element={[<Event />, <EventModal onClosePath="/Events" />]}
            />
            <Route
              path="/Events/pastEvents/:eventId"
              element={[<Event />, <EventModal onClosePath="/Events" />]}
            />
            <Route
              path="/pastEvents/:eventId"
              element={[
                <PastEvent />,
                <EventModal onClosePath="/Events/pastEvents" />,
              ]}
            />

            <Route
              path="/Events/:eventId/Form"
              element={[<Event />, <EventForm />]}
            />
            <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
            <Route
              path="/TermsAndConditions"
              element={<TermsAndConditions />}
            />
            <Route path="*" element={<Error />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route
              path="/Login"
              element={
                authCtx.isLoggedIn ? <Navigate to="/profile" /> : <Login />
              }
            />
            <Route
              path="/SignUp"
              element={
                authCtx.isLoggedIn ? <Navigate to="/profile" /> : <Signup />
              }
            />
            <Route
              path="/ForgotPassword"
              element={
                authCtx.isLoggedIn ? (
                  <Navigate to="/profile" />
                ) : (
                  <ForgotPassword />
                )
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
