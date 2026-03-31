import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link to="/" className="flex items-center">
              <div className="h-8 w-8 bg-primary-600 rounded-lg"></div>
              <span className="ml-2 text-xl font-bold">Template</span>
            </Link>
            <p className="text-gray-400 text-base">
              A modern React template with Vite and Tailwind CSS for building beautiful web applications.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Solutions</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-300 hover:text-white">Marketing</a></li>
                  <li><a href="#" className="text-base text-gray-300 hover:text-white">Analytics</a></li>
                  <li><a href="#" className="text-base text-gray-300 hover:text-white">Commerce</a></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-300 hover:text-white">Pricing</a></li>
                  <li><a href="#" className="text-base text-gray-300 hover:text-white">Documentation</a></li>
                  <li><a href="#" className="text-base text-gray-300 hover:text-white">Guides</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} React Template. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer