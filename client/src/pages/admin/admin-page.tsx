export default function AdminPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Admin functionality will go here */}
                <div className="border rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Manage Teachers
                    </h2>
                    {/* Teacher management content */}
                </div>
                <div className="border rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        View All Courses
                    </h2>
                    {/* Course listing content */}
                </div>
                <div className="border rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        View All Logs
                    </h2>
                    {/* Logs content */}
                </div>
            </div>
        </div>
    );
}
