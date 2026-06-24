import { Toaster } from "./components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from './lib/query-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { LanguageProvider } from './lib/LanguageContext';
import UserNotRegisteredError from './components/UserNotRegisteredError';
import Home from './pages/Home';
import AWPII from './pages/AWPII';
import AfricaBlockchainAwards from './pages/AfricaBlockchainAwards';
import SiteLayout from './components/layout/SiteLayout';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import FrancophopeNetwork from './pages/FrancophoneNetwork';
import TermsOfUse from './pages/TermsOfUse';
import CountryTracker from './pages/CountryTracker';
import Publications from './pages/Publications';
import CountryProfile from './pages/CountryProfile';
import EnforcementWatch from './pages/EnforcementWatch';
import CapacityBuilding from './pages/CapacityBuilding';
import AnalyticsTracker from './components/AnalyticsTracker';
import ScrollToHash from './components/ScrollToHash';
import IndabaSeries from './pages/IndabaSeries';
import { useTracker } from './hooks/useTracker';
import StablecoinTracker from './pages/StablecoinTracker';


// Admin
import Login from "./admin/pages/Login";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminPublications from "./admin/pages/AdminPublications";
import Articles from "./admin/pages/Articles";
import Reports from "./admin/pages/Reports";
import Events from "./admin/pages/Events";
import Analytics from "./admin/pages/Analytics"
import AdminLayout from "./admin/Layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";


const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

 // Initialize analytics tracking
 useTracker();


  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
return (
  <Routes>

    {/* =========================
        PUBLIC WEBSITE
    ========================== */}
    <Route element={<SiteLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/awpii" element={<AWPII />} />
      <Route path="/africa-blockchain-awards" element={<AfricaBlockchainAwards />} />
      <Route path="/about" element={<About />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-use" element={<TermsOfUse />} />
      <Route path="/francophone-network" element={<FrancophopeNetwork />} />
      <Route path="/country-tracker" element={<CountryTracker />} />
      <Route path="/publications" element={<Publications />} />
      <Route path="/country-tracker/:country" element={<CountryProfile />} />
      <Route path="/enforcement-watch" element={<EnforcementWatch />} />
      <Route path="/capacity-building" element={<CapacityBuilding />} />
      <Route path="/stablecoin-tracker" element={<StablecoinTracker />} />
     
      <Route path="/indaba-series" element={<IndabaSeries />} />
    
    </Route>

    {/* =========================
        ADMIN LOGIN
    ========================== */}
    <Route
      path="/admin/login"
      element={<Login />}
    />

    {/* =========================
        ADMIN DASHBOARD
    ========================== */}
 <Route path="/admin" element={<ProtectedRoute />}>
  <Route element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
    <Route path="adminpublications" element={<AdminPublications />} />
    <Route path="articles" element={<Articles/>}/>
    <Route path="reports" element={<Reports/>}/>
    <Route path="events" element={<Events/>}/>
     <Route path="analytics" element={<Analytics />} />
  </Route>
</Route>
</Routes>
);}



function App() {

  return (
    <LanguageProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <ScrollToHash />
              <AnalyticsTracker />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App