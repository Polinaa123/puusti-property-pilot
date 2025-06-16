import './pages/globals.css';
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from 'react-router-dom'
import Header from "./components/Header";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FreelancerRegistrationForm from './components/FreelanceRegistrationForm';
import AccountRouter from "./pages/AccountRouter";
import FreelancerAccount from "./pages/FreelancerAccount";
import CustomerAccount from "./pages/CustomerAccount";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
        <div className="min-h-screen bg-background">
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={
                <div className="pt-24 px-4">
                  <div style={{ padding: '50px', textAlign: 'center' }}>
                    group of 3 who need to succeed to live a happy life
                  </div>
                </div>
              }
            />

            <Route path="/something" element={
                <div className="pt-24 px-4">
                  <div style={{ padding: '50px', textAlign: 'center' }}>
                    something for you to click on "contact us"
                  </div>
                </div>
              }
            />

            <Route path="/for-investors" element={
                <div className="pt-24 px-4">
                  <div style={{ padding: '50px', textAlign: 'center' }}>
                    PLEASE, give us some money :((((( 
                  </div>
                </div>
              }
            />

            <Route path="/contact-us" element={
                <div className="pt-24 px-4">
                  <div style={{ padding: '50px', textAlign: 'center' }}>
                    contact us only if you have money
                  </div>
                </div>
              }
            />
            <Route path="/register" element={<FreelancerRegistrationForm />} />
            <Route path="/account" element={<AccountRouter />} />
            <Route path="/account/freelancer" element={<FreelancerAccount />} />
            <Route path="/account/customer" element={<CustomerAccount />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;