import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";

import { getDashboardData } from "../../api/dashboard";

import { wait } from "../../utils";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeMembers: 0,
    totalBorrowings: 0,
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

      const resPromise = await getDashboardData();

      const [res] = await Promise.all([resPromise, wait(600)]);

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

  const renderCardSkeleton = () => (
    <div className="mt-2">
      <Skeleton width="30%" height="1.4rem" />
    </div>
  );

  const renderTableSkeleton = () => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <tr key={idx} className="border-b border-default">
        <td className="px-6 py-4">
          <Skeleton width="80%" height="1rem" />
        </td>
        <td className="px-6 py-4">
          <Skeleton width="70%" height="1rem" />
        </td>
        <td className="px-6 py-4">
          <Skeleton width="60%" height="1rem" />
        </td>
        <td className="px-6 py-4">
          <Skeleton width="50%" height="1rem" />
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <h1 className="pl-2 my-2 text-3xl font-medium">Dashboard</h1>
      <div className="w-full p-2">
        <div className="grid grid-cols-4 gap-2">
          <div className="px-4 py-5 rounded-md border  border-slate-100 shadow-sm">
            <p>Total Books</p>
            <p className="mt-2 text-xl font-bold">
              {loading ? renderCardSkeleton() : stats.totalBooks}
            </p>
          </div>
          <div className="px-4 py-5 rounded-md border  border-slate-100 shadow-sm">
            <p>Active Members</p>
            <p className="mt-2 text-xl font-bold">
              {loading ? renderCardSkeleton() : stats.activeMembers}
            </p>
          </div>
          <div className="px-4 py-5 rounded-md border  border-slate-100 shadow-sm">
            <p>Total Books Borrowed</p>
            <p className="mt-2 text-xl font-bold">
              {loading ? renderCardSkeleton() : stats.totalBorrowings}
            </p>
          </div>
          <div className="px-4 py-5 rounded-md border  border-slate-100 shadow-sm">
            <p>Overdue Borrowings</p>
            <p className="mt-2 text-xl font-bold">
              {loading ? renderCardSkeleton() : stats.overdueBorrowings}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex items-start gap-2 p-2">
        <div className="w-[75%] p-2">
          <div>
            <h3 className="text-xl font-medium mb-3">Recent Borrowings</h3>

            <div class="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
              <table class="w-full text-sm text-left rtl:text-right text-body shadow-md">
                <thead class="bg-slate-200 border-b border-default">
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
                    renderTableSkeleton()
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
        <div className="w-[25%] p-2">
          <div className="w-full mt-3">
            <h3 className="text-xl font-medium mb-3">Quick Actions</h3>
            <div className="w-full flex flex-wrap items-center gap-2">
              <Button
                label="Add Author"
                size="small"
                className="border-2 text-sm border-slate-200 p-1 px-2 rounded-md"
                onClick={() => goTo("/authors?modal=create")}
              />
              <Button
                label="Add Book"
                size="small"
                className="border-2 text-sm border-slate-200 p-1 px-2 rounded-md"
                onClick={() => goTo("/books?modal=create")}
              />
              <Button
                label="Add Member"
                size="small"
                className="border-2 text-sm border-slate-200 p-1 px-2 rounded-md"
                onClick={() => goTo("/members?modal=create")}
              />
              <Button
                label="Add Borrowing"
                size="small"
                className="border-2 text-sm border-slate-200 p-1 px-2 rounded-md"
                onClick={() => goTo("/borrowings?modal=create")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
