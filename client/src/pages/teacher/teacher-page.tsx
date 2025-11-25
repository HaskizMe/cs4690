export default function TeacherPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Teacher functionality will go here */}
                <div className="border rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">My Courses</h2>
                    {/* Course listing content */}
                </div>
                <div className="border rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Create Course
                    </h2>
                    {/* Create course form */}
                </div>
                <div className="border rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">My Logs</h2>
                    {/* Logs content */}
                </div>
            </div>
        </div>
    );
}
