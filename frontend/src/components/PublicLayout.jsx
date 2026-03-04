import TopNav from "./TopNav.jsx";
import Footer from "./Footer.jsx";
import ViewTransition from "./ViewTransition.jsx";

const PublicLayout = ({ children }) => {
  return (
    <div className="app-shell min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#0f1826] to-[#0a0e18]">
      <TopNav />
      <main className="mx-auto w-full max-w-[1200px] px-6 pb-16">
        <ViewTransition>{children}</ViewTransition>
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
