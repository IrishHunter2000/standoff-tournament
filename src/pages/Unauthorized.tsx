export function Unauthorized() {
    return (
        <div className="text-center mt-10">
            <h2 className="text-xl font-bold">Access Denied</h2>
            <p className="text-gray-500 mt-2">
                You do not have permission to view this page.
            </p>
        </div>
    );
}
