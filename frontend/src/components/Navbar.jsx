import { Link, useLocation } from "react-router-dom";
import { motion }             from "framer-motion";
import { Camera, Images, Home as HomeIcon } from "lucide-react";

const links = [
  { to: "/",        label: "Home",    Icon: HomeIcon },
  { to: "/upload",  label: "Upload",  Icon: Camera  },
  { to: "/gallery", label: "Gallery", Icon: Images  },
];

export default function Navbar() {
  const { pathname } = useLocation();
  if (pathname === "/admin") return null;

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-40 bg-ivory/90 backdrop-blur-md border-b border-blush/20 shadow-sm"
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🌸</span>
          <span className="font-script text-2xl text-blush">Our Day</span>
        </Link>
        <ul className="flex items-center gap-1">
          {links.map(({ to, label, Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-body font-medium
                  transition-all duration-200
                  ${pathname === to
                    ? "bg-blush/20 text-blush"
                    : "text-gray-500 hover:text-blush hover:bg-blush/10"}
                `}
                aria-current={pathname === to ? "page" : undefined}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </motion.nav>
  );
}