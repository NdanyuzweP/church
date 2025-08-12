import React, { useState, useEffect } from 'react';
import { Users, Clock, MapPin, Mail, Phone, Calendar, Heart } from 'lucide-react';
import axios from 'axios';

interface Ministry {
  _id: string;
  name: string;
  description: string;
  purpose: string;
  meetingTime: string;
  meetingLocation: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone?: string;
  imageUrl?: string;
  images: string[];
  activities: string[];
}

const Ministries = () => {
  const [ministries, setMinistries] = useState<Ministry[]>([]);

  useEffect(() => {
    fetchMinistries();
  }, []);

  const fetchMinistries = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/ministries');
      setMinistries(response.data);
    } catch (error) {
      console.error('Error fetching ministries:', error);
      // Mock data for demonstration
      setMinistries([
        {
          _id: '1',
          name: "Men's Ministry",
          description: "A ministry focused on discipling men to be godly leaders in their homes, churches, and communities through Bible study, fellowship, and accountability.",
          purpose: "To encourage men in their walk with Christ and equip them to lead with biblical integrity",
          meetingTime: "Saturday 7:00 AM - 8:30 AM",
          meetingLocation: "Church Conference Room, Kigali",
          contactPerson: "Pastor Emmanuel Nzeyimana",
          contactEmail: "men@rbckigali.org",
          contactPhone: "+250 788 123 456",
          images: [
            'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/7715986/pexels-photo-7715986.jpeg?auto=compress&cs=tinysrgb&w=800'
          ],
          activities: [
            "Weekly Bible study and discussion",
            "Monthly fellowship breakfast",
            "Quarterly men's retreats",
            "Community service projects",
            "Mentorship programs"
          ]
        },
        {
          _id: '2',
          name: "Women's Ministry",
          description: "A community of women growing together in their relationship with Christ through Bible study, prayer, and mutual encouragement in all seasons of life.",
          purpose: "To glorify God by helping women grow in biblical womanhood and serve the church and community",
          meetingTime: "Thursday 2:00 PM - 4:00 PM",
          meetingLocation: "Church Fellowship Hall, Kigali",
          contactPerson: "Mrs. Grace Mukamana",
          contactEmail: "women@rbckigali.org",
          contactPhone: "+250 788 234 567",
          images: [
            'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/5428833/pexels-photo-5428833.jpeg?auto=compress&cs=tinysrgb&w=800'
          ],
          activities: [
            "Weekly Bible study groups",
            "Prayer meetings and intercession",
            "Annual women's conference",
            "Community outreach programs",
            "Hospitality training",
            "Mentoring young women"
          ]
        },
        {
          _id: '3',
          name: "Children's Ministry",
          description: "Teaching children the truths of Scripture through engaging lessons, worship, and activities that help them grow in their knowledge and love of Jesus Christ.",
          purpose: "To partner with parents in raising children who know, love, and follow Jesus Christ",
          meetingTime: "Sunday 9:00 AM - 10:30 AM (during service)",
          meetingLocation: "Children's Building, Kigali",
          contactPerson: "Mrs. Sarah Uwimana",
          contactEmail: "children@rbckigali.org",
          images: [
            'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1094072/pexels-photo-1094072.jpeg?auto=compress&cs=tinysrgb&w=800'
          ],
          activities: [
            "Age-appropriate Bible lessons",
            "Scripture memory programs",
            "Christian songs and worship",
            "Arts and crafts",
            "Vacation Bible School",
            "Children's choir"
          ]
        },
        {
          _id: '4',
          name: "Youth Ministry",
          description: "Equipping teenagers and young adults with a solid biblical foundation to navigate life's challenges while growing in their faith and serving others.",
          purpose: "To disciple young people to be faithful followers of Christ in their generation",
          meetingTime: "Sunday 5:00 PM - 7:00 PM",
          meetingLocation: "Youth Center, Kigali",
          contactPerson: "Pastor David Munyemana",
          contactEmail: "youth@rbckigali.org",
          contactPhone: "+250 788 345 678",
          images: [
            'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/7551737/pexels-photo-7551737.jpeg?auto=compress&cs=tinysrgb&w=800'
          ],
          activities: [
            "Weekly youth group meetings",
            "Bible study and discipleship",
            "Youth camps and retreats",
            "Community service projects",
            "Sports and recreation",
            "Evangelism training"
          ]
        },
        {
          _id: '5',
          name: "Conferences Ministry",
          description: "Organizing biblical conferences and seminars that strengthen the church through expository preaching, reformed theology, and practical Christian living.",
          purpose: "To provide opportunities for deeper theological education and spiritual growth",
          meetingTime: "Quarterly conferences and special events",
          meetingLocation: "Main Sanctuary and Conference Facilities, Kigali",
          contactPerson: "Pastor John Uwimana",
          contactEmail: "conferences@rbckigali.org",
          images: [
            'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=800'
          ],
          activities: [
            "Reformed theology conferences",
            "Pastoral training seminars",
            "Marriage and family workshops",
            "Evangelism conferences",
            "Youth leadership training",
            "Women's and men's conferences"
          ]
        }
      ]);
    }
  };

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold  text-gray-900 mb-4">
            Our Ministries
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            At Reformation Baptist Church of Kigali, we offer various ministries 
            to help you grow in your faith, serve others, and build meaningful relationships 
            within our church community.
          </p>
        </div>

        {/* Ministries Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {ministries.map((ministry, index) => (
            <div 
              key={ministry._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Ministry Image */}
              <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 relative">
                {ministry.imageUrl ? (
                  <img 
                    src={ministry.imageUrl.startsWith('http') ? ministry.imageUrl : `http://localhost:5001${ministry.imageUrl}`}
                    alt={ministry.name}
                    className="w-full h-full object-cover"
                  />
                ) : ministry.images.length > 0 ? (
                  <img 
                    src={ministry.images[0]} 
                    alt={ministry.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Heart className="h-16 w-16 text-white opacity-60" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h2 className="text-2xl font-bold ">{ministry.name}</h2>
                </div>
              </div>

              {/* Ministry Content */}
              <div className="p-6">
                {/* Description */}
                <p className="text-gray-700 mb-4">
                  {ministry.description}
                </p>

                {/* Purpose */}
                <div className="bg-primary-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-primary-700 mb-2">Our Purpose</h3>
                  <p className="text-primary-600 text-sm">
                    {ministry.purpose}
                  </p>
                </div>

                {/* Meeting Information */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">Meeting Time</div>
                      <div className="text-sm text-gray-600">{ministry.meetingTime}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">Location</div>
                      <div className="text-sm text-gray-600">{ministry.meetingLocation}</div>
                    </div>
                  </div>
                </div>

                {/* Activities */}
                {ministry.activities.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary-500" />
                      Activities
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {ministry.activities.slice(0, 3).map((activity, actIndex) => (
                        <li key={actIndex} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 flex-shrink-0"></span>
                          {activity}
                        </li>
                      ))}
                      {ministry.activities.length > 3 && (
                        <li className="text-primary-500 text-sm">
                          +{ministry.activities.length - 3} more activities
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Contact Information */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-primary-500" />
                      <span className="text-gray-600">{ministry.contactPerson}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-primary-500" />
                      <a 
                        href={`mailto:${ministry.contactEmail}`}
                        className="text-primary-500 hover:text-primary-600"
                      >
                        {ministry.contactEmail}
                      </a>
                    </div>
                    {ministry.contactPhone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-primary-500" />
                        <a 
                          href={`tel:${ministry.contactPhone}`}
                          className="text-primary-500 hover:text-primary-600"
                        >
                          {ministry.contactPhone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-primary-600 text-white rounded-lg p-8 text-center mt-12 animate-fade-in">
          <h2 className="text-3xl font-bold  mb-4">
            Get Involved
          </h2>
          <p className="text-xl text-primary-100 mb-6 max-w-3xl mx-auto">
            We believe that every member of our church family has been gifted by God 
            to serve in His kingdom. Find your place in our ministries and grow 
            alongside fellow believers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Users className="mr-2 h-5 w-5" />
              Contact Us
            </a>
            <a
              href="mailto:info@rbckigali.org"
              className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-primary-600 transition-all duration-200"
            >
              <Mail className="mr-2 h-5 w-5" />
              Ask Questions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ministries;