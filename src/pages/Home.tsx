import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Users, Heart, ArrowRight, Play, Clock, MapPin } from 'lucide-react';

const Home = () => {
  const beliefs = [
    {
      title: "Sola Scriptura",
      description: "Scripture alone as our final authority for faith and practice"
    },
    {
      title: "Sola Gratia",
      description: "Salvation by grace alone through faith alone in Christ alone"
    },
    {
      title: "Reformed Theology",
      description: "Committed to the doctrines of grace as outlined in Scripture"
    },
    {
      title: "1689 Confession",
      description: "Adhering to the London Baptist Confession of Faith"
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div 
          className="relative bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/161060/cross-against-the-sky-161060.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`,
            backgroundBlendMode: 'overlay'
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
            <div className="text-center animate-slide-up">
              <h1 className="text-4xl md:text-6xl font-bold  mb-6">
                Welcome to<br />
                <span className="text-accent-400">Reformation Baptist Church</span><br />
                <span className="text-2xl md:text-3xl text-gray-200">of Kigali</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
                Proclaiming the Gospel in Rwanda through expository preaching, 
                reformed theology, and biblical community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-primary-600 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  Visit Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <a
                  href="https://youtube.com/@reformationbaptistchurchkigali"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-3 border-2 border-white text-base font-medium rounded-lg text-white hover:bg-white hover:text-primary-600 transition-all duration-200"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Join Our Live Stream
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Worship Service Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-bold  text-gray-900 mb-6">
                Our Worship Service
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join us each Sunday for worship that centers on the Word of God. 
                Our services feature expository preaching, traditional hymns, 
                and reformed liturgy in a warm, welcoming atmosphere.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-primary-500" />
                  <div>
                    <div className="font-semibold text-gray-900">Sunday Worship</div>
                    <div className="text-gray-600">9:00 AM - 03:00 PM</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-6 w-6 text-primary-500" />
                  <div>
                    <div className="font-semibold text-gray-900">Location</div>
                    <div className="text-gray-600">Kigali, Rwanda</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Book className="h-6 w-6 text-primary-500" />
                  <div>
                    <div className="font-semibold text-gray-900">Bible Study</div>
                    <div className="text-gray-600">Wednesday 6:00 PM</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="animate-slide-up">
              <img
                src="https://images.pexels.com/photos/372326/pexels-photo-372326.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                alt="Church Sanctuary"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What We Believe Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold  text-gray-900 mb-4">
              What We Believe
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our faith is grounded in Scripture and the historic reformed tradition, 
              as summarized in the 1689 London Baptist Confession of Faith.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beliefs.map((belief, index) => (
              <div 
                key={belief.title} 
                className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Book className="h-12 w-12 text-primary-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{belief.title}</h3>
                <p className="text-gray-600">{belief.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 animate-slide-up">
            <Link
              to="/resources"
              className="inline-flex items-center px-8 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors duration-200"
            >
              Learn More
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold  mb-6">
              Join Our Community
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Whether you're visiting Kigali or looking for a church home, 
              we invite you to worship with us and grow in the knowledge of Christ.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <Users className="mr-2 h-5 w-5" />
                Get Directions
              </Link>
              <Link
                to="/ministries"
                className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-primary-600 transition-all duration-200"
              >
                <Heart className="mr-2 h-5 w-5" />
                Our Ministries
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;