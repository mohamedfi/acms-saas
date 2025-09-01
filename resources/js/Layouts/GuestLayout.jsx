import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
export default function Guest({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-20 sm:justify-center sm:pt-0 dark:bg-gray-900">
            <div className="mt-4">
                <Link href="/">
                    <div className="flex items-center justify-center w-40 h-40 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/30">
                        <ApplicationLogo className="h-32 w-32 object-contain" />
                    </div>
                </Link>
            </div>

            <div className="mt-4 w-full overflow-hidden bg-white px-2 py-2 shadow-md sm:rounded-lg dark:bg-gray-800">
                {children}
            </div>
        </div>
    );
}
