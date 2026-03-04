import TopNav from "./TopNav.jsx";
import Sidebar from "./Sidebar.jsx";
import Footer from "./Footer.jsx";
import ViewTransition from "./ViewTransition.jsx";

const AppLayout = ({ children }) => {
  return (
    <div className="app-shell min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#0f1826] to-[#0a0e18]">
      <TopNav />
      <div className="mx-auto flex w-full max-w-[1440px] gap-6 px-6 pb-16 pt-8">
        <Sidebar />
        <main className="flex-1">
          <ViewTransition>{children}</ViewTransition>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;
