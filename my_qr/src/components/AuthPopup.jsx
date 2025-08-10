import { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../store/user_auth_context';

const AuthPopup = ({ onClose }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const {login} = useAuth();

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Here you would typically call your authentication API
    // For demo purposes, we'll just store in localStorage
    if (isLoginView) {
      console.log('Logging in with:', email, password);
      // Simulate successful login
     
      const formData = {
          email,
          password
      }


try {
    const response = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // If using sessions/cookies
    });

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Login success:", data.uName);
    login(data);
    
   
      onClose();
    // Handle successful login here

  } catch (error) {
    console.error("Login error:", error);
  } 

      
     
    } else {
      console.log('Registering with:', name, email, password);
      // Simulate successful registration and login
      const user = { email, name };
      localStorage.setItem('user', JSON.stringify(user));
      document.cookie = `user=${JSON.stringify(user)}; path=/; max-age=${60 * 60 * 24 * 7}`; // 1 week
      
      onClose();
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    console.log('Google login success:', credentialResponse);
    // Here you would verify the credential with your backend
    // For demo purposes, we'll decode the JWT to get user info
    try {
      const payload = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      const user = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        googleId: payload.sub
      };
      localStorage.setItem('user', JSON.stringify(user));
      document.cookie = `user=${JSON.stringify(user)}; path=/; max-age=${60 * 60 * 24 * 7}`;
      
      onClose();
    } catch (error) {
      console.error('Error decoding Google token:', error);
    }
  };

  const handleGoogleError = () => {
    console.log('Google login failed');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {isLoginView ? 'Login' : 'Register'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        <div className="mb-4">
          <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              width="300"
            />
          </GoogleOAuthProvider>
        </div>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLoginView && (
            <div className="mb-4">
              <label className="block mb-2 text-gray-700" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border rounded-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-2 text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="5"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            {isLoginView ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="text-blue-600 hover:text-blue-800"
          >
            {isLoginView
              ? "Don't have an account? Register"
              : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPopup;