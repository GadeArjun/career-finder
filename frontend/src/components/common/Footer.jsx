import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useUserContext } from "../../context/UserContext";

function Footer() {
  const { user } = useUserContext();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-4 pt-12 pb-6 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* About Section */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-white">Career Finder</h4>
          <p className="text-gray-400 text-sm leading-relaxed">
            Career Finder helps you explore top colleges, personalized learning
            paths, and track your skills & achievements. Start your career
            journey today.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:text-blue-400 transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Quick Links</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <Link to="/" className="hover:text-blue-400 transition">
                Home
              </Link>
            </li>
            {!user && (
              <li>
                <Link to="/register" className="hover:text-blue-400 transition">
                  Register
                </Link>
              </li>
            )}
            {user && (
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-blue-400 transition"
                >
                  Dashboard
                </Link>
              </li>
            )}
            <li>
              <Link to="/profile" className="hover:text-blue-400 transition">
                Profile
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-400 transition">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Contact</h4>
          <p className="text-gray-400 text-sm">
            Email: support@careerfinder.com
          </p>
          <p className="text-gray-400 text-sm">Phone: +91 9876543210</p>
          <p className="text-gray-400 text-sm">
            Address: Pune, Maharashtra, India
          </p>
        </div>

        {/* Newsletter / CTA */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Stay Updated</h4>
          <p className="text-gray-400 text-sm">
            Subscribe to our newsletter for career tips and latest updates.
          </p>
          <form className="flex flex-col  gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="p-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 transition"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition text-white font-semibold"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
        <p>© 2025 Career Finder. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
