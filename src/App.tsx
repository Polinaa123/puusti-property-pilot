
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/about"
            element={
              <div style={{ padding: '50px', textAlign: 'center' }}>
                group of 3 who need to succeed to live a happy life
              </div>
            }
          />
          <Route
            path="/something"
            element={
              <div style={{ padding: '50px', textAlign: 'center' }}>
                something for you to click on "contact us"
              </div>
            }
          />
          <Route
            path="/for-investors"
            element={
              <div style={{ padding: '50px', textAlign: 'center' }}>
                PLEASE, give us some money :((((( 
              </div>
            }
          />
          <Route
            path="/contact-us"
            element={
              <div style={{ padding: '50px', textAlign: 'center' }}>
                contact us only if you have money
              </div>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
