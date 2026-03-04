import { useLocation } from "react-router-dom";

const ViewTransition = ({ children }) => {
  const location = useLocation();

  return (
    <div key={location.pathname} className="view-fade">
      {children}
    </div>
  );
};

export default ViewTransition;
