import { Link } from "react-router-dom";
import { Clock, User } from "lucide-react";

export default function BottomNav() {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-2xl">
      <div className="flex justify-around p-4">
        <Link to="/" className="flex flex-col items-center space-y-1 text-slate-400">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span className="text-xs font-medium">Home</span>
        </Link>

        <Link to="/history" className="flex flex-col items-center space-y-1 text-slate-400">
          <Clock size={24} />
          <span className="text-xs font-medium">History</span>
        </Link>

        <Link to="/profile" className="flex flex-col items-center space-y-1 text-slate-400">
          <User size={24} />
          <span className="text-xs font-medium">Profile</span>
        </Link>
      </div>
    </div>
  );
}
