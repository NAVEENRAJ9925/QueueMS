import { Link } from 'react-router-dom';
import { Clock, Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
  return (
    <footer className="glass-dark text-slate-200 border-t border-white/10">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Clock className="h-6 w-6 text-sky-300" />
              <span className="ml-2 text-xl font-bold text-white drop-shadow">QueueMaster</span>
            </div>
            <p className="mb-4">Modern queue management solution for businesses and customers.</p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/_.na._x_.een._?igsh=MWUxdGZxcnFnc3J5Ng==" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white hover:bg-white/10 p-2 rounded-md transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://x.com/Naveenraj9925R?t=FI3MVtD-HSUvyu6tdshDMg&s=09" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white hover:bg-white/10 p-2 rounded-md transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/naveenraj-r-1b8b27288" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white hover:bg-white/10 p-2 rounded-md transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white drop-shadow mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-300 hover:text-white hover:bg-white/10 px-2 py-1 rounded transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-300 hover:text-white hover:bg-white/10 px-2 py-1 rounded transition-colors">
                  Log In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-slate-300 hover:text-white hover:bg-white/10 px-2 py-1 rounded transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <a href="#features" className="text-slate-300 hover:text-white hover:bg-white/10 px-2 py-1 rounded transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-slate-300 hover:text-white hover:bg-white/10 px-2 py-1 rounded transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white drop-shadow mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-sky-300 mr-2 mt-1" />
                <span>2/194 Muttanchetty Road, Devarayapuram,Namakkkal -637021</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-sky-300 mr-2" />
                <span>+91 6383466784</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-sky-300 mr-2" />
                <a href="mailto:support@naveenraj9925@gmail.com" className="text-slate-300 hover:text-white transition-colors">
                  support@naveenraj9925.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} QueueMaster. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-slate-300 hover:text-white hover:bg-white/10 px-2 py-1 rounded transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-300 hover:text-white hover:bg-white/10 px-2 py-1 rounded transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;