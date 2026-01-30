import axios, { AxiosError } from "axios";
import { ApiError, ApiErrorResponse } from "@/types/errors";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true, // Important for Sanctum SPA authentication
    timeout: 30000, // 30 seconds timeout (increased for slow connections)
});

// CSRF cookie cache to avoid multiple requests
let csrfCookiePromise: Promise<void> | null = null;

// Helper function to get cookie value by name
function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    try {
        const cookies = document.cookie;
        if (!cookies) return null;

        // Try exact match first
        const exactMatch = cookies.match(
            new RegExp(
                `(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`
            )
        );
        if (exactMatch) {
            return decodeURIComponent(exactMatch[1]);
        }

        // Try case-insensitive match
        const caseInsensitiveMatch = cookies.match(
            new RegExp(
                `(?:^|; )${name.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                )}=([^;]*)`,
                "i"
            )
        );
        if (caseInsensitiveMatch) {
            return decodeURIComponent(caseInsensitiveMatch[1]);
        }

        // Try splitting method
        const value = `; ${cookies}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            const cookieValue = parts.pop()?.split(";").shift();
            if (cookieValue) {
                return decodeURIComponent(cookieValue);
            }
        }

        // Try lowercase version
        const partsLower = value.split(`; ${name.toLowerCase()}=`);
        if (partsLower.length === 2) {
            const cookieValue = partsLower.pop()?.split(";").shift();
            if (cookieValue) {
                return decodeURIComponent(cookieValue);
            }
        }
    } catch (error) {
        console.error("Error reading cookie:", error);
    }
    return null;
}

// Helper function to check if XSRF-TOKEN cookie exists
function hasXSRFToken(): boolean {
    if (typeof document === "undefined") return false;
    return getCookie("XSRF-TOKEN") !== null || getCookie("xsrf-token") !== null;
}

// Function to get CSRF cookie with retry mechanism
async function getCsrfCookie(forceRefresh: boolean = false): Promise<void> {
    // If forcing refresh, clear cache
    if (forceRefresh) {
        csrfCookiePromise = null;
    }

    // If cookie already exists and not forcing refresh, return immediately
    if (!forceRefresh && hasXSRFToken()) {
        return Promise.resolve();
    }

    if (csrfCookiePromise && !forceRefresh) {
        return csrfCookiePromise;
    }

    const baseURL =
        process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
        "http://localhost:8000";

    const maxRetries = 3;
    let retryCount = 0;

    const attemptFetch = async (): Promise<void> => {
        try {
            const response = await axios.get(`${baseURL}/sanctum/csrf-cookie`, {
                withCredentials: true,
                timeout: 15000,
                headers: {
                    Accept: "application/json",
                },
            });

            // Check response headers for Set-Cookie
            if (process.env.NODE_ENV === "development") {
                const setCookieHeader = response.headers["set-cookie"];
                if (setCookieHeader) {
                    console.log(
                        "✅ CSRF cookie response received, Set-Cookie headers:",
                        setCookieHeader
                    );
                } else {
                    console.warn(
                        "⚠️ No Set-Cookie header in CSRF cookie response"
                    );
                }
            }

            // Wait and verify cookie is set with polling
            let attempts = 0;
            const maxPollAttempts = 10;
            const pollInterval = 100; // 100ms between checks

            while (attempts < maxPollAttempts) {
                await new Promise((resolve) => setTimeout(resolve, pollInterval));
                if (hasXSRFToken()) {
                    if (process.env.NODE_ENV === "development") {
                        console.log("✅ XSRF-TOKEN cookie verified and accessible");
                    }
                    return;
                }
                attempts++;
            }

            // If cookie still not found after polling, throw error
            throw new Error("XSRF-TOKEN cookie not found after request");
        } catch (error: unknown) {
            retryCount++;
            
            if (retryCount < maxRetries) {
                // Wait before retry (exponential backoff)
                const delay = retryCount * 200;
                if (process.env.NODE_ENV === "development") {
                    console.warn(
                        `⚠️ CSRF cookie request failed (attempt ${retryCount}/${maxRetries}), retrying in ${delay}ms...`
                    );
                }
                await new Promise((resolve) => setTimeout(resolve, delay));
                return attemptFetch();
            }

            // Max retries reached
            csrfCookiePromise = null;
            
            if (
                (error instanceof Error && (error as any).code === "ECONNABORTED") ||
                (error instanceof Error && error.message?.includes("timeout"))
            ) {
                console.warn(
                    "CSRF cookie request timed out after retries. Request may fail CSRF validation.",
                    {
                        baseURL,
                        timeout: "15s",
                        hint: "Backend server may be slow or unreachable. Check if server is running.",
                    }
                );
            } else if (
                (error instanceof Error && (error as any).code === "ERR_NETWORK") ||
                (error instanceof Error && error.message === "Network Error")
            ) {
                console.warn(
                    "CSRF cookie request failed due to network error after retries. Request may fail CSRF validation.",
                    {
                        baseURL,
                        hint: "Backend server may be down. Check if server is running.",
                    }
                );
            } else {
                console.warn("CSRF cookie request failed after retries:", error instanceof Error ? error.message : String(error));
            }

            throw error;
        }
    };

    csrfCookiePromise = attemptFetch().then(() => {
        // Reset promise after 5 minutes to refresh cookie
        setTimeout(() => {
            csrfCookiePromise = null;
        }, 5 * 60 * 1000);
    }).catch((error) => {
        csrfCookiePromise = null;
        throw error;
    });

    return csrfCookiePromise;
}

// Request interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        // Get CSRF cookie before POST/PUT/DELETE requests
        if (
            ["post", "put", "patch", "delete"].includes(
                config.method?.toLowerCase() || ""
            )
        ) {
            try {
                // Get CSRF cookie first (this will set XSRF-TOKEN cookie)
                // The function now includes retry logic and cookie verification
                await getCsrfCookie();
                
                // Additional wait to ensure cookie is fully processed by browser
                await new Promise((resolve) => setTimeout(resolve, 300));

                // Get XSRF-TOKEN cookie and set it as X-XSRF-TOKEN header
                // Laravel Sanctum uses XSRF-TOKEN (uppercase)
                let xsrfToken = getCookie("XSRF-TOKEN");

                // If not found, try lowercase (some browsers may lowercase cookie names)
                if (!xsrfToken) {
                    xsrfToken = getCookie("xsrf-token");
                }

                // Also try reading from document.cookie directly as fallback
                if (!xsrfToken && typeof document !== "undefined") {
                    const allCookies = document.cookie;
                    const match = allCookies.match(
                        /(?:^|;\s*)XSRF-TOKEN=([^;]*)/
                    );
                    if (match) {
                        xsrfToken = decodeURIComponent(match[1]);
                    }
                }

                if (xsrfToken) {
                    // Ensure headers object exists
                    config.headers = config.headers || {};
                    config.headers["X-XSRF-TOKEN"] = xsrfToken;

                    if (process.env.NODE_ENV === "development") {
                        console.log(
                            "✅ CSRF token added to request header:",
                            xsrfToken.substring(0, 20) + "..."
                        );
                    }
                } else {
                    // Only warn in development
                    if (process.env.NODE_ENV === "development") {
                        console.error(
                            "❌ XSRF-TOKEN cookie not found after CSRF cookie request"
                        );
                        console.log("Available cookies:", document.cookie);
                        console.log("Request URL:", config.url);
                        console.log(
                            "This request will likely fail with 419 error"
                        );
                    }
                }
            } catch (error: unknown) {
                // Log error but don't block the request
                if (process.env.NODE_ENV === "development") {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    console.error("Failed to get CSRF cookie:", errorMessage);
                }
                // Request will proceed without CSRF token - backend will handle validation
            }
        }

        // For FormData, don't set Content-Type - let browser set it with boundary
        if (config.data instanceof FormData) {
            if (config.headers) {
                delete config.headers["Content-Type"];
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // Handle network errors (connection issues)
        if (
            error.code === "ERR_NETWORK" ||
            error.message === "Network Error" ||
            error.code === "ECONNREFUSED"
        ) {
            const baseURL = axiosInstance.defaults.baseURL;
            const backendURL =
                baseURL?.replace("/api", "") || "http://localhost:8000";

            // Only log once per session to avoid console spam
            if (!window.__networkErrorLogged) {
                console.warn(
                    `%c⚠️ Backend Server Not Available%c\n\n` +
                        `The Laravel backend server is not running or unreachable.\n` +
                        `Expected URL: ${backendURL}\n\n` +
                        `To fix this:\n` +
                        `1. Open a terminal in the 'backend' folder\n` +
                        `2. Run: php artisan serve\n` +
                        `3. Make sure it's running on port 8000\n\n` +
                        `The application will continue to work, but API calls will fail.`,
                    "color: #f59e0b; font-weight: bold; font-size: 14px;",
                    "color: #6b7280; font-size: 12px;"
                );
                window.__networkErrorLogged = true;

                // Clear the flag after 30 seconds to allow re-logging if server comes back online
                setTimeout(() => {
                    window.__networkErrorLogged = false;
                }, 30000);
            }

            // For GET requests, we'll let the component handle the error gracefully
            // but provide a more helpful error message
            const networkError = {
                ...error,
                isNetworkError: true,
                message: `Unable to connect to backend server. Please ensure the Laravel server is running at ${backendURL}`,
                code: error.code || "NETWORK_ERROR",
                backendURL,
            };

            return Promise.reject(networkError);
        }

        // Handle timeout errors with retry logic
        if (
            error.code === "ECONNABORTED" ||
            error.message?.includes("timeout")
        ) {
            const originalRequest = error.config;

            // Only retry GET requests (safe to retry)
            if (
                originalRequest &&
                originalRequest.method?.toLowerCase() === "get" &&
                !originalRequest._retryCount
            ) {
                const retryCount = (originalRequest._retryCount || 0) + 1;
                const maxRetries = 2; // Retry up to 2 times

                if (retryCount <= maxRetries) {
                    originalRequest._retryCount = retryCount;
                    originalRequest._retry = true;

                    // Wait before retry (exponential backoff)
                    const delay = retryCount * 1000; // 1s, 2s

                    console.warn(
                        `Request timeout (attempt ${retryCount}/${maxRetries}). Retrying in ${delay}ms...`,
                        {
                            url: originalRequest.url,
                        }
                    );

                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(axiosInstance(originalRequest));
                        }, delay);
                    });
                }
            }

            // If no retry or max retries reached, reject with error
            console.error("Request timeout (max retries reached):", {
                baseURL: axiosInstance.defaults.baseURL,
                url: originalRequest?.url,
                retryCount: originalRequest?._retryCount || 0,
            });

            return Promise.reject({
                ...error,
                isTimeoutError: true,
                message:
                    "Request timed out. The server may be slow or unreachable. Please check if the backend is running.",
            });
        }

        // Handle CSRF token mismatch (419)
        if (error.response?.status === 419) {
            // Clear CSRF cookie cache and retry once
            csrfCookiePromise = null;

            const originalRequest = error.config;

            // Only retry if not already retried (max 1 retry for 419)
            if (!originalRequest._csrfRetry) {
                originalRequest._csrfRetry = true;

                try {
                    if (process.env.NODE_ENV === "development") {
                        console.warn("🔄 419 CSRF error detected, refreshing token and retrying...");
                    }

                    // Get fresh CSRF cookie with force refresh
                    await getCsrfCookie(true); // Force refresh

                    // Wait to ensure cookie is set and accessible
                    await new Promise((resolve) => setTimeout(resolve, 500));

                    // Get XSRF-TOKEN cookie and set it as X-XSRF-TOKEN header
                    let xsrfToken = getCookie("XSRF-TOKEN");
                    if (!xsrfToken) {
                        xsrfToken = getCookie("xsrf-token");
                    }

                    if (xsrfToken) {
                        originalRequest.headers = originalRequest.headers || {};
                        originalRequest.headers["X-XSRF-TOKEN"] = xsrfToken;
                        
                        if (process.env.NODE_ENV === "development") {
                            console.log("✅ CSRF token refreshed, retrying request...");
                        }

                        // Retry the original request
                        return axiosInstance(originalRequest);
                    } else {
                        throw new Error("XSRF-TOKEN cookie still not available after refresh");
                    }
                } catch (retryError: unknown) {
                    if (process.env.NODE_ENV === "development") {
                        const errorMessage = retryError instanceof Error ? retryError.message : String(retryError);
                        console.error("❌ Failed to refresh CSRF token:", errorMessage);
                    }
                    return Promise.reject({
                        ...error,
                        message: "CSRF token refresh failed. Please refresh the page and try again.",
                        isCsrfError: true,
                    });
                }
            } else {
                // Already retried once, don't retry again
                return Promise.reject({
                    ...error,
                    message: "CSRF validation failed. Please refresh the page and try again.",
                    isCsrfError: true,
                });
            }
        }

        // Handle common errors
        if (error.response?.status === 401) {
            // Only redirect to login for protected routes
            if (typeof window !== "undefined") {
                const pathname = window.location.pathname;
                const protectedRoutes = ["/portal", "/bookings"];

                // Check if current path is a protected route
                const isProtectedRoute = protectedRoutes.some((route) =>
                    pathname.startsWith(route)
                );

                if (isProtectedRoute && !pathname.includes("/login")) {
                    const currentPath =
                        window.location.pathname + window.location.search;
                    window.location.href = `/login?redirect=${encodeURIComponent(
                        currentPath
                    )}`;
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
