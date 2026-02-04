import FileUpload from "@/components/FileUpload";

export default async function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

      {/* Module 2.39: Object Storage Demo */}
      <div className="mb-8">
        <FileUpload />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 border rounded-xl shadow-sm bg-white dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-2">Lesson {i}: React Fundamentals</h2>
            <p className="text-gray-500 mb-4">Duration: 45 mins - Offline Ready</p>
            <span className="text-green-600 font-medium">Completed</span>
          </div>
        ))}
      </div>
    </div>
  );
}
