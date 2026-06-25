
export default function RecentUsersTable({ users }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl">
      <div className="p-5 border-b border-slate-800">
        <h2 className="font-semibold text-lg">
          Recent Users
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="text-slate-400 text-left">
              <th className="p-4">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-t border-slate-800"
              >
                <td className="p-4">{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}