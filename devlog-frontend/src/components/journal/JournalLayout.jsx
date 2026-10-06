import { Outlet, NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  `px-3 py-1.5 rounded-md text-sm ${isActive ? 'bg-journal/20 text-journal' : 'text-text-secondary hover:text-text-primary'}`;

const JournalLayout = () => {
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <nav className="bg-bg-secondary/50 rounded-lg p-3 border border-border flex flex-wrap gap-2">
        <NavLink to="/journal/overview" className={linkClass}>Overview</NavLink>
        <NavLink to="/journal/add" className={linkClass}>Add Entry</NavLink>
        <NavLink to="/journal/history" className={linkClass}>History</NavLink>
        <NavLink to="/journal/java-track" className={linkClass}>Java Track</NavLink>
        <NavLink to="/journal/templates" className={linkClass}>Templates</NavLink>
      </nav>
      <Outlet />
    </div>
  );
};

export default JournalLayout;
