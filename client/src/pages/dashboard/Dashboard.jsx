import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { getDashboardData } from "../../api/dashboard";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeMembers: 0,
    borrowedToday: 0,
    overdueBorrowings: 0,
    recentBorrowings: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await getDashboardData();
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const goTo = (path) => {
    navigate(path);
  };

  return (
    <div>
      <h1 className="pl-2 my-2 text-3xl font-medium">Dashboard</h1>
      <div className="w-full p-2">
        <div className="grid grid-cols-4 gap-2">
          <div className="px-4 py-5 rounded-md border-2 border-slate-100 shadow-md">
            <p>Total Books</p>
            <p className="text-xl font-bold">
              {loading ? "..." : stats.totalBooks}
            </p>
          </div>
          <div className="px-4 py-5 rounded-md border-2 border-slate-100 shadow-md">
            <p>Active Members</p>
            <p className="text-xl font-bold">
              {loading ? "..." : stats.activeMembers}
            </p>
          </div>
          <div className="px-4 py-5 rounded-md border-2 border-slate-100 shadow-md">
            <p>Books Borrowed Today</p>
            <p className="text-xl font-bold">
              {loading ? "..." : stats.totalBorrowings}
            </p>
          </div>
          <div className="px-4 py-5 rounded-md border-2 border-slate-100 shadow-md">
            <p>Overdue Borrowings</p>
            <p className="text-xl font-bold">
              {loading ? "..." : stats.overdueBorrowings}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex items-start gap-2 p-2 mt-4">
        <div className="w-3/4 p-2">
          <div>
            <h3 className="text-xl font-medium mb-3">Recent Borrowings</h3>

            <div class="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
              <table class="w-full text-sm text-left rtl:text-right text-body">
                <thead class="bg-neutral-secondary-soft border-b border-default">
                  <tr>
                    <th scope="col" class="px-6 py-3 font-medium">
                      Member
                    </th>
                    <th scope="col" class="px-6 py-3 font-medium">
                      Book
                    </th>
                    <th scope="col" class="px-6 py-3 font-medium">
                      Borrowed Date
                    </th>
                    <th scope="col" class="px-6 py-3 font-medium">
                      Due Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : stats.recentBorrowings.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center">
                        No recent borrowings
                      </td>
                    </tr>
                  ) : (
                    stats.recentBorrowings.map((b) => (
                      <tr
                        key={b.id}
                        className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default"
                      >
                        <td className="px-6 py-4">{b.member.name}</td>
                        <td className="px-6 py-4">{b.book.title}</td>
                        <td className="px-6 py-4">
                          {new Date(b.borrowDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          {new Date(b.dueDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="w-1/4 p-2">
          <div className="border border-slate-200 p-4 px-5 rounded-md shadow-sm">
            <h3 className="text-xl font-medium mb-3">AI Book Insights</h3>
            <ul className="list-disc list-inside mb-5">
              <li>Your library's most borrowed genre this month</li>
              <li>Books predicted to be high demand</li>
            </ul>
            <button className="w-full bg-blue-500 p-1 rounded-md text-white">
              Generate Recommendations
            </button>
          </div>
          <div className="w-full mt-3">
            <h3 className="text-xl font-medium mb-3">Quick Actions</h3>
            <div className="w-full flex flex-wrap items-center gap-2">
              <button
                className="border-2 text-sm border-slate-200 p-1 px-2 rounded-md"
                onClick={() => goTo("/authors?modal=create")}
              >
                Add Author
              </button>
              <button
                className="border-2 text-sm border-slate-200 p-1 px-2 rounded-md"
                onClick={() => goTo("/books?modal=create")}
              >
                Add Book
              </button>
              <button
                className="border-2 text-sm border-slate-200 p-1 px-2 rounded-md"
                onClick={() => goTo("/members?modal=create")}
              >
                Add Member
              </button>
              <button
                className="border-2 text-sm border-slate-200 p-1 px-2 rounded-md"
                onClick={() => goTo("/borrowings?modal=create")}
              >
                New Borrowing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
