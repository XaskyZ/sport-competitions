export default function HelpPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-blue-600 mb-8">Help & Documentation</h1>

                <div className="space-y-6">
                    {/* About Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold text-blue-600 mb-4">📋 About the System</h2>
                        <p className="text-gray-700 leading-relaxed">
                            <strong>Sports Competitions Management System</strong> is a comprehensive application
                            for managing sports competitions, athletes, coaches, and results. The system allows
                            you to track athlete performance, manage competition schedules, and generate detailed reports.
                        </p>
                    </div>

                    {/* Features Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold text-blue-600 mb-4">✨ Features</h2>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span><strong>Athletes Management:</strong> Add, edit, view, and delete athletes. Track their sport type and assigned coach.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span><strong>Coaches Directory:</strong> View all coaches and their information.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span><strong>Competitions:</strong> Browse all competitions and their types.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span><strong>Reports:</strong> Generate reports on awards and athlete statistics.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span><strong>Dashboard:</strong> Quick overview of system statistics.</span>
                            </li>
                        </ul>
                    </div>

                    {/* How to Use Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold text-blue-600 mb-4">🚀 How to Use</h2>
                        <div className="space-y-4 text-gray-700">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">Adding an Athlete:</h3>
                                <ol className="list-decimal list-inside ml-4 space-y-1">
                                    <li>Navigate to the Athletes page</li>
                                    <li>Click the &quot;+ Add Athlete&quot; button</li>
                                    <li>Fill in the athlete&apos;s name, type, sport, and coach</li>
                                    <li>Click &quot;Create&quot; to save</li>
                                </ol>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">Editing an Athlete:</h3>
                                <ol className="list-decimal list-inside ml-4 space-y-1">
                                    <li>Find the athlete in the table</li>
                                    <li>Click the &quot;Edit&quot; button (pencil icon)</li>
                                    <li>Modify the information</li>
                                    <li>Click &quot;Update&quot; to save changes</li>
                                </ol>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">Deleting an Athlete:</h3>
                                <ol className="list-decimal list-inside ml-4 space-y-1">
                                    <li>Find the athlete in the table</li>
                                    <li>Click the &quot;Delete&quot; button (trash icon)</li>
                                    <li>Confirm the deletion</li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    {/* Technical Info */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold text-blue-600 mb-4">⚙️ Technical Information</h2>
                        <div className="grid grid-cols-2 gap-4 text-gray-700">
                            <div>
                                <p><strong>Framework:</strong> Next.js 16</p>
                                <p><strong>Database:</strong> PostgreSQL 16</p>
                            </div>
                            <div>
                                <p><strong>Frontend:</strong> React 19, Tailwind CSS</p>
                                <p><strong>Version:</strong> 1.0.0</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-blue-600 mb-4">📞 Support</h2>
                        <p className="text-gray-700">
                            For technical support or questions, please contact your system administrator.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
