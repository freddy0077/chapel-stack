"use client";

import "./AuthStyles.css";

export default function SocialButtons() {
  return (
    <div className="mt-6">
      <div className="auth-divider">
        <span>Or continue with</span>
      </div>

      <div className="social-buttons mt-4">
        {/* Google */}
        <button className="social-button" aria-label="Sign in with Google">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        </button>

        {/* Facebook */}
        <button className="social-button" aria-label="Sign in with Facebook">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-600"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
          </svg>
        </button>

        {/* Apple */}
        <button className="social-button" aria-label="Sign in with Apple">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M16.25 2C16.25 2 15.25 2 14.96 3.54C14.67 5.07 15.69 6.18 16.07 6.61C16.44 7.03 17.5 8 17.13 9.75C16.77 11.5 15.5 13.22 14.09 13.89C12.67 14.56 11.26 14 10.5 13.22C9.74 12.44 8.29 12.39 7.2 13.22C6.11 14.05 5 16.43 5 18.31C5 20.18 6.21 23.63 7.68 23.91C9.16 24.19 10.13 23.5 11.03 23.5C11.93 23.5 12.5 24.19 14 24.19C15.5 24.19 16.17 22.3 16.17 22.3C16.17 22.3 17.31 21.76 18.18 20.18C19.05 18.6 19.19 16.78 19.19 16.78C19.19 16.78 17.43 16.04 17.15 14.35C16.88 12.66 18 11.37 18 11.37C18 11.37 19.53 10.23 19.53 7.82C19.53 5.41 17.84 3.28 16.25 2Z"
              fillRule="nonzero"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
