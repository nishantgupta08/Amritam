"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

// Dynamically import TiptapEditor to avoid SSR issues
const TiptapEditor = dynamic(() => import("@/app/components/TiptapEditor"), {
  ssr: false,
  loading: () => <div className="border border-gray-300 rounded-lg p-4 min-h-[300px] bg-gray-50">Loading editor...</div>,
});

interface Blog {
  id: string;
  title: string;
  titlePart1: string;
  titlePart2: string;
  category: string;
  readTime: string;
  description: string;
  image: string;
  color: 'blue' | 'pink' | 'green';
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>>({
    title: "",
    titlePart1: "",
    titlePart2: "",
    category: "Cardiology",
    readTime: "5 min read",
    description: "",
    image: "/blog_1.png",
    color: "blue",
    content: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [docxFile, setDocxFile] = useState<File | null>(null);
  const [uploadingDocx, setUploadingDocx] = useState(false);

  // Logout handler
  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setPassword("");
    localStorage.removeItem("adminAuth");
    sessionStorage.removeItem("adminLastActive");
    setBlogs([]);
    setEditingBlog(null);
    setShowForm(false);
  }, []);

  // Simple authentication (in production, use proper auth)
  const handleLogin = async () => {
    if (!password.trim()) {
      setLoginError("Please enter a password");
      return;
    }

    setIsLoggingIn(true);
    setLoginError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem("adminAuth", "true");
        sessionStorage.setItem("adminLastActive", Date.now().toString());
        await fetchBlogs();
      } else {
        setLoginError(data.error || "Incorrect password. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Connection error. Please check your internet and try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAuthenticated(true);
      fetchBlogs();
    }
  }, []);

  // Auto-logout when user navigates away or closes the tab/window
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleBeforeUnload = () => {
      // Clear authentication when page is being unloaded (navigating away, closing tab)
      localStorage.removeItem("adminAuth");
      sessionStorage.removeItem("adminLastActive");
    };

    const handleVisibilityChange = () => {
      // If user switches tabs/windows and comes back after 5 minutes, logout
      if (document.hidden) {
        // User switched away - set a timestamp
        sessionStorage.setItem("adminLastActive", Date.now().toString());
      } else {
        // User came back - check if more than 5 minutes passed
        const lastActive = sessionStorage.getItem("adminLastActive");
        if (lastActive) {
          const timeDiff = Date.now() - parseInt(lastActive);
          const fiveMinutes = 5 * 60 * 1000;
          if (timeDiff > fiveMinutes) {
            handleLogout();
            alert("Session expired due to inactivity. Please login again.");
          }
        }
      }
    };

    const handleFocus = () => {
      // Check if user was away for more than 5 minutes
      const lastActive = sessionStorage.getItem("adminLastActive");
      if (lastActive) {
        const timeDiff = Date.now() - parseInt(lastActive);
        const fiveMinutes = 5 * 60 * 1000;
        if (timeDiff > fiveMinutes) {
          handleLogout();
          alert("Session expired due to inactivity. Please login again.");
        }
      }
    };

    // Detect navigation away from the page
    const handlePopState = () => {
      // User navigated back/forward - logout for security
      handleLogout();
    };

    // Listen for page unload (closing tab, navigating away)
    window.addEventListener("beforeunload", handleBeforeUnload);
    
    // Listen for visibility changes (switching tabs)
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Listen for window focus (coming back to tab)
    window.addEventListener("focus", handleFocus);

    // Listen for browser navigation (back/forward buttons)
    window.addEventListener("popstate", handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isAuthenticated, handleLogout]);

  // Inactivity timeout - logout after 15 minutes of no activity
  useEffect(() => {
    if (!isAuthenticated) return;

    let inactivityTimer: NodeJS.Timeout;
    let warningTimer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
      
      // Show warning at 13 minutes (2 minutes before logout)
      warningTimer = setTimeout(() => {
        const shouldContinue = confirm(
          "Your session will expire in 2 minutes due to inactivity. Click OK to continue your session."
        );
        if (shouldContinue) {
          resetTimer(); // Reset timer if user wants to continue
        }
      }, 13 * 60 * 1000); // 13 minutes

      // Logout after 15 minutes
      inactivityTimer = setTimeout(() => {
        handleLogout();
        alert("You have been logged out due to inactivity. Please login again.");
      }, 15 * 60 * 1000); // 15 minutes
    };

    // Reset timer on user activity
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"];
    events.forEach((event) => {
      document.addEventListener(event, resetTimer, { passive: true });
    });

    // Start the timer
    resetTimer();

    // Cleanup
    return () => {
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated, handleLogout]);

  // Auto-logout when navigating to a different route
  useEffect(() => {
    if (!isAuthenticated) return;

    // Monitor URL changes (for Next.js router navigation)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    const checkNavigation = () => {
      // Check if we're still on the admin page
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/admin')) {
          handleLogout();
        }
      }
    };

    // Override pushState and replaceState to detect navigation
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(checkNavigation, 100);
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(checkNavigation, 100);
    };

    // Cleanup
    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [isAuthenticated, handleLogout]);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/blogs");
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/blogs/upload-image', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, image: data.url });
        setImageFile(null);
        return data.url;
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to upload image');
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDocxUpload = async (file: File) => {
    setUploadingDocx(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/blogs/docx-to-html', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, content: data.html });
        setDocxFile(null);
        return data.html;
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to convert DOCX');
        return null;
      }
    } catch (error) {
      console.error('Error converting DOCX:', error);
      alert('Error converting DOCX');
      return null;
    } finally {
      setUploadingDocx(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Upload image if a new file is selected
      let imageUrl = formData.image;
      if (imageFile) {
        const uploadedUrl = await handleImageUpload(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          setIsLoading(false);
          return; // Stop if image upload failed
        }
      }

      const url = editingBlog ? `/api/blogs/${editingBlog.id}` : "/api/blogs";
      const method = editingBlog ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, image: imageUrl }),
      });

      if (response.ok) {
        await fetchBlogs();
        resetForm();
        alert(editingBlog ? "Blog updated successfully!" : "Blog added successfully!");
      } else {
        alert("Error saving blog");
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Error saving blog");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchBlogs();
        alert("Blog deleted successfully!");
      } else {
        alert("Error deleting blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Error deleting blog");
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      titlePart1: blog.titlePart1,
      titlePart2: blog.titlePart2,
      category: blog.category,
      readTime: blog.readTime,
      description: blog.description,
      image: blog.image,
      color: blog.color,
      content: blog.content || "",
    });
    setImageFile(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      titlePart1: "",
      titlePart2: "",
      category: "Cardiology",
      readTime: "5 min read",
      description: "",
      image: "",
      color: "blue",
      content: "",
    });
    setImageFile(null);
    setEditingBlog(null);
    setShowForm(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 max-w-md w-full border border-white/20">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform duration-200">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Portal
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">Secure access to blog management</p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError("");
                  }}
                  onKeyPress={(e) => e.key === "Enter" && !isLoggingIn && handleLogin()}
                  className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    loginError ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50 hover:bg-white"
                  }`}
                  placeholder="Enter your password"
                  disabled={isLoggingIn}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoggingIn}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {loginError && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm animate-fade-in">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{loginError}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoggingIn || !password.trim()}
              className={`w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-3.5 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 ${
                isLoggingIn || !password.trim() ? "opacity-50 cursor-not-allowed" : "hover:from-blue-700 hover:via-purple-700 hover:to-pink-700"
              }`}
            >
              {isLoggingIn ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>

            {/* Security Note */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-start gap-3 text-xs text-gray-500">
                <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p>Your session is secured with encrypted authentication. Access is logged for security purposes.</p>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-5px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Management</h1>
              <p className="text-gray-600">Manage your blog posts</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              >
                + Add New Blog
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Blog Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingBlog ? "Edit Blog" : "Add New Blog"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title (Part 1)
                  </label>
                  <input
                    type="text"
                    value={formData.titlePart1}
                    onChange={(e) => setFormData({ ...formData, titlePart1: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Theme
                  </label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value as 'blue' | 'pink' | 'green' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="blue">Blue</option>
                    <option value="pink">Pink</option>
                    <option value="green">Green</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Image
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 10 * 1024 * 1024) {
                            alert('File size must be less than 10MB');
                            return;
                          }
                          setImageFile(file);
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {uploadingImage && (
                      <p className="text-sm text-blue-600">Uploading image to Cloudinary...</p>
                    )}
                    {formData.image && !imageFile && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm text-green-700">Image uploaded to Cloudinary</span>
                          <a
                            href={formData.image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto text-sm text-blue-600 hover:text-blue-700 underline"
                          >
                            View Image
                          </a>
                        </div>
                        <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={formData.image}
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/blog_1.png';
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {imageFile && (
                      <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-blue-700">Selected: {imageFile.name}</span>
                        <button
                          type="button"
                          onClick={() => setImageFile(null)}
                          className="ml-auto text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Or enter image URL directly"
                    />
                    <p className="text-xs text-gray-500">Upload an image or enter a Cloudinary URL. Images are automatically optimized.</p>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Content (Rich Text Editor)
                  </label>
                  <div className="space-y-3">
                    {/* DOCX Upload */}
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 10 * 1024 * 1024) {
                              alert('File size must be less than 10MB');
                              return;
                            }
                            setDocxFile(file);
                          }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                      />
                      {docxFile && (
                        <button
                          type="button"
                          onClick={async () => {
                            if (docxFile) {
                              await handleDocxUpload(docxFile);
                            }
                          }}
                          disabled={uploadingDocx}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {uploadingDocx ? 'Converting...' : 'Convert DOCX'}
                        </button>
                      )}
                    </div>
                    {uploadingDocx && (
                      <p className="text-sm text-purple-600">Converting DOCX to HTML...</p>
                    )}
                    {/* Tiptap Editor */}
                    <TiptapEditor
                      content={formData.content || ''}
                      onChange={(content) => setFormData({ ...formData, content })}
                      placeholder="Start writing your blog content here..."
                    />
                    <p className="text-xs text-gray-500">
                      Use the toolbar above to format your content. You can also upload a .docx file to convert it to HTML.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : editingBlog ? "Update Blog" : "Add Blog"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Blogs List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Blogs ({blogs.length})</h2>
          
          {isLoading && !showForm ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading blogs...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No blogs found. Add your first blog!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <div key={blog.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      width={400}
                      height={225}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {blog.category}
                    </span>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {blog.description}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

