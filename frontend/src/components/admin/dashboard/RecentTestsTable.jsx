export default function RecentTestsTable({ tests }) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="p-5 border-b border-slate-800">
          <h2 className="font-semibold text-lg">
            Recent Tests
          </h2>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="text-slate-400 text-left">
              <th className="p-4">Title</th>
              <th>Category</th>
              <th>Questions</th>
              <th>Status</th>
            </tr>
          </thead>
  
          <tbody>
            {tests.map((test) => (
              <tr
                key={test._id}
                className="border-t border-slate-800"
              >
                <td className="p-4">{test.title}</td>
                <td>{test.category}</td>
                <td>{test.questionCount}</td>
                <td>
                  {test.isActive
                    ? "Active"
                    : "Inactive"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    );
  }