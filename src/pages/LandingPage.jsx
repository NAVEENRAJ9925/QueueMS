import { Link } from 'react-router-dom';
import { Clock, Users, LineChart, BarChart3, CheckCircle2 } from 'lucide-react';

function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-24">
        <div className="absolute inset-0 -z-10">
          {/* subtle overlay to improve contrast */}
          <div className="h-full w-full bg-gradient-to-b from-black/20 via-black/10 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 tracking-tight drop-shadow">
                Smart Queue Management for Modern Businesses
              </h1>
              <p className="text-xl mb-8 text-slate-200">
                Streamline your customer flow, reduce wait times and enhance customer satisfaction with our intelligent queue management system.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/signup" className="glass-dark glass-border text-white hover:bg-white/20 px-6 py-3 rounded-md font-medium text-center transition-transform-shadow glass-hover">
                  Get Started
                </Link>
                <Link to="/login" className="glass-dark border border-white/20 text-white hover:bg-white/20 px-6 py-3 rounded-md font-medium text-center transition-transform-shadow glass-hover">
                  Log In
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Queue Management" 
                className="rounded-xl neon-shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 drop-shadow">Powerful Features</h2>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto">
              Everything you need to manage queues efficiently and enhance customer experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-dark p-8 rounded-xl neon-shadow transition-transform-shadow glass-hover">
              <div className="bg-white/20 w-14 h-14 flex items-center justify-center rounded-full mb-6">
                <Users className="h-7 w-7 text-sky-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white drop-shadow">Real-time Queue Management</h3>
              <p className="text-slate-200">
                Monitor your queues in real-time. Add, remove, and prioritize customers with just a few clicks.
              </p>
            </div>

            <div className="glass-dark p-8 rounded-xl neon-shadow transition-transform-shadow glass-hover">
              <div className="bg-white/20 w-14 h-14 flex items-center justify-center rounded-full mb-6">
                <Clock className="h-7 w-7 text-sky-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white drop-shadow">Wait Time Predictions</h3>
              <p className="text-slate-200">
                Provide accurate wait time estimates to your customers, helping them plan accordingly.
              </p>
            </div>

            <div className="glass-dark p-8 rounded-xl neon-shadow transition-transform-shadow glass-hover">
              <div className="bg-white/20 w-14 h-14 flex items-center justify-center rounded-full mb-6">
                <LineChart className="h-7 w-7 text-sky-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white drop-shadow">Analytics Dashboard</h3>
              <p className="text-slate-200">
                Get valuable insights into your queue performance, peak hours, and customer flow patterns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 drop-shadow">How It Works</h2>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto">
              Simple steps to get started with QueueMaster
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                  1
                </div>
                <div className="hidden md:block absolute top-8 left-full w-full h-1 bg-blue-500" style={{ width: 'calc(100% - 4rem)' }}></div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white drop-shadow">Create Your Account</h3>
              <p className="text-slate-200">
                Sign up as a business owner or user and set up your profile in minutes.
              </p>
            </div>

            <div className="md:w-1/3 text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                  2
                </div>
                <div className="hidden md:block absolute top-8 left-full w-full h-1 bg-blue-500" style={{ width: 'calc(100% - 4rem)' }}></div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white drop-shadow">Create a Queue</h3>
              <p className="text-slate-200">
                Business owners can create and customize queues for their services.
              </p>
            </div>

            <div className="md:w-1/3 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white drop-shadow">Start Managing</h3>
              <p className="text-slate-200">
                Customers join queues and both sides track progress in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 drop-shadow">What Our Customers Say</h2>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto">
              Businesses and users love our queue management system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-dark p-6 rounded-xl neon-shadow">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center text-sky-300 font-bold">
                  JS
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-white drop-shadow">John Smith</h4>
                  <p className="text-slate-200">Restaurant Owner</p>
                </div>
              </div>
              <p className="text-slate-200">
                "QueueMaster has transformed how we handle waiting customers. Our customers love being able to see their position in the queue and get accurate wait times."
              </p>
            </div>

            <div className="glass-dark p-6 rounded-xl neon-shadow">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center text-sky-300 font-bold">
                  LD
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-white drop-shadow">Lisa Davis</h4>
                  <p className="text-slate-200">Dental Clinic Manager</p>
                </div>
              </div>
              <p className="text-slate-200">
                "As a healthcare provider, efficient patient flow is crucial. This system has reduced our wait times by 40% and significantly improved patient satisfaction."
              </p>
            </div>

            <div className="glass-dark p-6 rounded-xl neon-shadow">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center text-sky-300 font-bold">
                  RJ
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-white drop-shadow">Robert Johnson</h4>
                  <p className="text-slate-200">Regular User</p>
                </div>
              </div>
              <p className="text-slate-200">
                "I no longer have to physically wait in crowded waiting rooms. I can join the queue remotely and show up when it's almost my turn. It's been a game-changer!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white drop-shadow">Ready to Streamline Your Queue Management?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-slate-200">
            Join thousands of businesses already improving their customer experience with QueueMaster.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/signup" className="glass-dark glass-border text-white hover:bg-white/20 px-6 py-3 rounded-md font-medium transition-transform-shadow glass-hover">
              Sign Up Now
            </Link>
            <Link to="/login" className="glass-dark border border-white/20 text-white hover:bg-white/20 px-6 py-3 rounded-md font-medium transition-transform-shadow glass-hover">
              Log In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;