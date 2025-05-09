
export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#555BCA] p-4">
      <div className="card w-full max-w-[500px] bg-white shadow-2xl rounded-xl p-8">
        <div className="w-full flex justify-center mb-6">
          <div className="bg-[#555BCA]  rounded-lg shadow-md">
            <h1 className="text-white text-2xl font-bold ">TrueForce</h1>
          </div>
        </div>

        <div className="w-full form-control">
          <div className="mb-4">
            <label className="label">
              <span className="label-text text-gray-500 font-medium">Email address</span>
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              className="input bg-white border-gray-300 input-bordered w-full focus:border-[#555BCA] focus:ring-1 focus:ring-[#555BCA] transition-all"
            />
          </div>

          <div className="mb-2"> 
            <label className="label">
              <span className="label-text text-gray-500 font-medium">Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input bg-white border-gray-300 input-bordered w-full focus:border-[#555BCA] focus:ring-1 focus:ring-[#555BCA] transition-all"
            />
          </div>


          <div className="flex justify-end mb-4"> 
            <a href="#" className="text-sm text-[#555BCA] hover:text-[#3d43a0] hover:underline transition-all">Forgot Password?</a>
          </div>

          <button className="btn btn-primary bg-[#555BCA] hover:bg-[#4046a5] border-none text-white py-3 w-full mb-5 shadow-md hover:shadow-lg transition-all">
            Signup
          </button>

          <div className="divider text-gray-400 before:bg-gray-200 after:bg-gray-200 mb-5">or</div> 

          <div className="flex gap-4">
            <button className="btn btn-outline flex-1 gap-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all">
              
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
              
              <span className="text-sm normal-case font-medium text-gray-700">Sign in with Google</span>
            </button>

            <button className="btn btn-outline flex-1 gap-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all">
              
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 384 512" fill="currentColor">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
              </svg>
              
              <span className="text-sm normal-case font-medium text-gray-700">Sign in with Apple</span>
            </button>
          </div>

          
          
        </div>
      </div>
    </div>
  );
}