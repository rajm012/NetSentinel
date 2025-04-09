// src/components/layouts/DashboardLayout.jsx
import { Outlet, NavLink } from 'react-router-dom';

const navLinks = [
  { name: 'Realtime', path: '/realtime' },
  { name: 'Historical', path: '/historical' },
  { name: 'Threat Intel', path: '/threat-intel' },
];

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-4 shadow-md">
        <h1 className="text-2xl font-bold mb-6">Sniffer</h1>
        <nav className="space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded ${
                  isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
