import AppContent from "../components/landing-page/AppContent";
import AppFooter from "../components/landing-page/AppFooter";
import AppNavigation from "../components/landing-page/AppNavigation";

const LandingLayout: React.FC = () => {
  return (
    <>
      <AppNavigation />
      <AppContent />
      <AppFooter />
    </>
  );
};

export default LandingLayout;
