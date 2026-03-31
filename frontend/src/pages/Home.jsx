import { useState } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  const [count, setCount] = useState(0)

  const features = [
    {
      title: 'React 18',
      description: 'Latest React features with hooks and concurrent rendering.',
      icon: '⚛️'
    },
    {
      title: 'Vite',
      description: 'Fast build tool with hot module replacement and optimized builds.',
      icon: '⚡'
    },
    {
      title: 'Tailwind CSS',
      description: 'Utility-first CSS framework for rapid UI development.',
      icon: '🎨'
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            React + Vite + Tailwind
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A modern, fast, and customizable template to kickstart your next React project with the best tools available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/about" className="btn-primary text-lg px-8 py-4">
              Get Started
            </Link>
            <button className="btn-secondary text-lg px-8 py-4">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with the latest technologies and best practices for modern web development.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-8 text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Interactive Demo</h2>
          <div className="card p-8 max-w-md mx-auto">
            <p className="text-lg text-gray-600 mb-6">Count: {count}</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setCount(count + 1)}
                className="btn-primary"
              >
                Increment
              </button>
              <button 
                onClick={() => setCount(0)}
                className="btn-secondary"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home