import React, { useState, useEffect } from 'react';
import { MapPin, Users, Calendar, Camera, Heart } from 'lucide-react';
import axios from 'axios';

interface MissionLocation {
  name: string;
  address: string;
  description: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface MissionUpdate {
  title: string;
  content: string;
  date: Date;
  photos: string[];
}

interface Mission {
  _id: string;
  name: string;
  description: string;
  purpose: string;
  startDate: string;
  endDate?: string;
  status: 'Active' | 'Completed' | 'On Hold';
  imageUrl?: string;
  locations: MissionLocation[];
  updates: MissionUpdate[];
  budget?: number;
  teamMembers?: string[];
}

const Missions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/missions');
      setMissions(response.data);
    } catch (error) {
      console.error('Error fetching missions:', error);
      // Mock data for demonstration
      setMissions([
        {
          _id: '1',
          name: 'Rural Church Planting',
          description: 'Establishing reformed churches in rural communities across Northern Rwanda, focusing on training local pastors and providing biblical resources in Kinyarwanda.',
          purpose: 'To plant and establish reformed churches in rural areas',
          startDate: '2023-06-01',
          status: 'Active',
          imageUrl: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=800',
          locations: [
            {
              name: 'Musanze District',
              address: 'Musanze, Northern Province, Rwanda',
              description: 'Primary church planting location in the northern region'
            },
            {
              name: 'Rubavu District',
              address: 'Rubavu, Western Province, Rwanda',
              description: 'Secondary location for church development'
            }
          ],
          updates: [
            {
              title: 'New Church Plant in Musanze',
              content: 'We are excited to announce the establishment of a new church plant in Musanze district. The congregation has grown to 45 members over the past six months.',
              date: new Date('2024-01-15'),
              photos: []
            },
            {
              title: 'Pastor Training Program Launch',
              content: 'Launched our intensive pastor training program with 12 candidates from various rural communities. The program focuses on expository preaching and reformed theology.',
              date: new Date('2024-01-01'),
              photos: []
            }
          ],
          budget: 50000,
          teamMembers: ['Pastor Emmanuel', 'Elder John', 'Deacon Sarah']
        },
        {
          _id: '2',
          name: 'Urban Ministry Outreach',
          description: 'Reaching the urban population of Kigali through evangelism, discipleship, and community service, with a focus on young professionals and university students.',
          purpose: 'To reach and disciple urban populations in Kigali',
          startDate: '2023-03-01',
          status: 'Active',
          imageUrl: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800',
          locations: [
            {
              name: 'Kigali City Center',
              address: 'Downtown Kigali, Rwanda',
              description: 'Main urban ministry location'
            },
            {
              name: 'University District',
              address: 'Near University of Rwanda, Kigali',
              description: 'Campus ministry focus area'
            }
          ],
          updates: [
            {
              title: 'University Campus Ministry',
              content: 'Started weekly Bible studies at three major universities in Kigali. We have seen tremendous interest from students seeking to understand the Gospel.',
              date: new Date('2024-01-10'),
              photos: []
            },
            {
              title: 'Community Service Initiative',
              content: 'Organized food distribution and medical clinics for underserved communities in Kigali, serving over 200 families during the Christmas season.',
              date: new Date('2023-12-20'),
              photos: []
            }
          ],
          budget: 35000,
          teamMembers: ['Pastor Grace', 'Youth Leader David']
        },
        {
          _id: '3',
          name: 'Bible Translation Project',
          description: 'Supporting the translation of reformed theological resources and study materials into Kinyarwanda to better serve the local church.',
          purpose: 'To provide reformed resources in local languages',
          startDate: '2023-01-01',
          status: 'Active',
          imageUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800',
          locations: [
            {
              name: 'Translation Center',
              address: 'Kigali, Rwanda',
              description: 'Main translation and publishing facility'
            }
          ],
          updates: [
            {
              title: 'Completed Westminster Shorter Catechism',
              content: 'Successfully completed the translation of the Westminster Shorter Catechism into Kinyarwanda. 500 copies have been printed and distributed to local churches.',
              date: new Date('2024-01-05'),
              photos: []
            },
            {
              title: '1689 Confession Translation Progress',
              content: 'Made significant progress on translating the 1689 London Baptist Confession. Currently 60% complete with expected finish date in mid-2024.',
              date: new Date('2023-11-15'),
              photos: []
            }
          ],
          budget: 25000,
          teamMembers: ['Translator Paul', 'Editor Mary']
        }
      ]);
    }
  };

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold  text-gray-900 mb-4">
            Our Missions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us in spreading the Gospel and serving communities across Rwanda and beyond. 
            Discover how God is working through our various mission initiatives.
          </p>
        </div>

        {/* Mission Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {missions.map((mission, index) => (
            <div 
              key={mission._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedMission(mission)}
            >
              <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 relative">
                {mission.imageUrl ? (
                  <img 
                    src={mission.imageUrl.startsWith('http') ? mission.imageUrl : `http://localhost:5001${mission.imageUrl}`}
                    alt={mission.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Heart className="h-16 w-16 text-white opacity-60" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold ">{mission.name}</h3>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className="h-4 w-4 text-primary-500" />
                  <span className="text-sm text-gray-600">
                    {mission.locations && mission.locations.length > 0 
                      ? mission.locations[0].name 
                      : 'Multiple Locations'}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {mission.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Started {new Date(mission.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{mission.updates ? mission.updates.length : 0} Updates</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mission Detail Modal */}
        {selectedMission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold  text-gray-900">
                  {selectedMission.name}
                </h2>
                <button
                  onClick={() => setSelectedMission(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary-500" />
                  <span className="text-gray-600">
                    {selectedMission.locations && selectedMission.locations.length > 0 
                      ? selectedMission.locations.map(loc => loc.name).join(', ')
                      : 'Multiple Locations'}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-6">
                  {selectedMission.description}
                </p>

                {/* Mission Image */}
                {selectedMission.imageUrl && (
                  <div className="mb-8">
                    <img
                      src={selectedMission.imageUrl.startsWith('http') ? selectedMission.imageUrl : `http://localhost:5001${selectedMission.imageUrl}`}
                      alt={selectedMission.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                {/* Locations */}
                {selectedMission.locations && selectedMission.locations.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Mission Locations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedMission.locations.map((location, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">{location.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                          <p className="text-sm text-gray-700">{location.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Updates */}
                {selectedMission.updates && selectedMission.updates.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Mission Updates
                    </h3>
                    <div className="space-y-6">
                      {selectedMission.updates.map((update, index) => (
                        <div key={index} className="border-l-4 border-primary-500 pl-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{update.title}</h4>
                            <span className="text-sm text-gray-500">
                              {new Date(update.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">{update.content}</p>
                          {update.photos && update.photos.length > 0 && (
                            <div className="grid grid-cols-2 gap-2">
                              {update.photos.map((photo, photoIndex) => (
                                <img
                                  key={photoIndex}
                                  src={photo.startsWith('http') ? photo : `http://localhost:5001${photo}`}
                                  alt={`Update ${index + 1} photo ${photoIndex + 1}`}
                                  className="w-full h-24 object-cover rounded"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Team Members */}
                {selectedMission.teamMembers && selectedMission.teamMembers.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Mission Team
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMission.teamMembers.map((member, index) => (
                        <span key={index} className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Budget */}
                {selectedMission.budget && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget</h3>
                    <p className="text-2xl font-bold text-primary-600">
                      ${selectedMission.budget.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Missions;