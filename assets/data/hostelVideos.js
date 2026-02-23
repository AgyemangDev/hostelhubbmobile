
import first from '../vidoes/first.mp4';

export const HOSTEL_VIDEOS = [
  {
    id: 'hostel-1',
    institution: 'KNUST',
    hostelName: 'Ocean View Hostel',
    type: 'hostel',
    frontImage: 'https://example.com/images/ocean-view.jpg',
    porter: {
      name: 'Porter Mensah',
      number: '+233 24 000 0001',
    },
    location: {
      address: 'Boadi, Kumasi',
      coordinates: {
        latitude: 6.6745,
        longitude: -1.5643,
      }
    },
    createdAt: '2024-01-15T10:30:00Z',
    videos: [
      {
        id: 'vid-1a',
        videoUrl: 'https://firebasestorage.googleapis.com/v0/b/hostelhubbgh.appspot.com/o/hostel_videos%2F1753638693152_new.mp4?alt=media&token=f99817f0-e12a-4810-9db1-c9b4570f9715',
        roomType: 'One in One',
        roomDescription: 'Spacious room with AC and balcony view.',
        price: "8500",
        views: 120
      },
      {
        id: 'vid-1b',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        roomType: 'Two in One',
        roomDescription: 'Cozy double room with fans and study desks.',
        price: "6800",
        views: 89
      },
      {
        id: 'vid-1c',
        videoUrl: 'https://firebasestorage.googleapis.com/v0/b/hostelhubbgh.appspot.com/o/hostel_videos%2F1753638473283_test.mp4?alt=media&token=377b3a0f-c5ef-494c-b090-bff98f7f5c8c',
        roomType: 'Four in One',
        roomDescription: 'Shared room with bunk beds and lockers.',
        price: "4200",
        views: 153,
        porterOverride: {
          name: 'Porter Adwoa',
          number: '+233 24 123 4567',
        }
      },
    ]
  },

  {
    id: 'hostel-2',
    institution: 'KNUST',
    hostelName: 'Green Garden Homestel',
    type: 'homestel',
    frontImage: 'https://example.com/images/green-garden.jpg',
    porter: {
      name: 'Porter Kwame',
      number: '+233 20 111 2233',
    },
    location: {
      address: 'Ayeduase New Site, Kumasi',
      coordinates: {
        latitude: 6.6782,
        longitude: -1.5631,
      }
    },
    createdAt: '2024-01-20T09:00:00Z',
    videos: [
      {
        id: 'vid-2a',
        videoUrl: 'https://firebasestorage.googleapis.com/v0/b/hostelhubbgh.appspot.com/o/hostel_videos%2F1753637901221_test2.mp4?alt=media&token=7a4dd2c2-5a28-4350-82e6-4d7b01d90d08',
        roomType: 'Three in One',
        roomDescription: 'Affordable triple room with sea breeze view.',
        price: "5500",
        views: 77
      }
    ]
  }
];
