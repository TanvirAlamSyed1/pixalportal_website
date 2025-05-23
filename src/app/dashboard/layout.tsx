import Sidebar from './dashboardSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <Sidebar />
      <main className="flex-1 p-10 ml-16 lg:ml-64 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}

