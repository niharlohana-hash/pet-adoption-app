require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Pet = require('../models/Pet');
const Application = require('../models/Application');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const { connectDB } = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();
    console.log('🧹 Clearing existing database collections...');

    await User.deleteMany();
    await Pet.deleteMany();
    await Application.deleteMany();
    await Conversation.deleteMany();
    await Message.deleteMany();
    await Notification.deleteMany();

    console.log('👤 Creating users...');

    // Admin user
    const admin = await User.create({
      name: 'Shelter Director Alex',
      email: 'admin@pawsome.org',
      password: 'Admin@123',
      role: 'admin',
      phone: '+1 (415) 555-0199',
      address: '100 Pawsome Way, San Francisco, CA',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Lifelong animal welfare advocate and founder of Pawsome Haven Shelter.',
    });

    // Regular user 1
    const user1 = await User.create({
      name: 'Emma Watson',
      email: 'user@example.com',
      password: 'User@123',
      role: 'user',
      phone: '+1 (415) 555-0144',
      address: '220 Market St, San Francisco, CA',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      bio: 'Remote UX designer looking for a furry companion to share morning walks.',
    });

    // Regular user 2
    const user2 = await User.create({
      name: 'Liam Chen',
      email: 'liam@example.com',
      password: 'User@123',
      role: 'user',
      phone: '+1 (415) 555-0177',
      address: '742 Evergreen Terrace, Oakland, CA',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Cat enthusiast living in a spacious apartment with a sunlit balcony.',
    });

    console.log('🐾 Creating pets...');

    const petsData = [
      {
        name: 'Barnaby',
        species: 'Dog',
        breed: 'Golden Retriever',
        age: 2,
        ageUnit: 'years',
        gender: 'Male',
        size: 'Large',
        photos: [
          'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'Barnaby is an extraordinarily gentle and loving Golden Retriever who loves swimming, fetch, and belly rubs. He gets along wonderfully with kids and other dogs.',
        healthStatus: 'Excellent, fully vaccinated and neutered',
        vaccinated: true,
        spayedNeutered: true,
        specialNeeds: false,
        adoptionFee: 150,
        status: 'Available',
        location: 'San Francisco, CA',
        shelterContact: 'adoptions@pawsome.org',
        createdBy: admin._id,
      },
      {
        name: 'Luna',
        species: 'Cat',
        breed: 'Siamese Mix',
        age: 1,
        ageUnit: 'years',
        gender: 'Female',
        size: 'Small',
        photos: [
          'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'Luna is a talkative and curious Siamese beauty with striking blue eyes. She enjoys curling up in warm laps and chasing laser pointers.',
        healthStatus: 'Healthy, microchipped & vaccinated',
        vaccinated: true,
        spayedNeutered: true,
        specialNeeds: false,
        adoptionFee: 95,
        status: 'Available',
        location: 'Berkeley, CA',
        shelterContact: 'adoptions@pawsome.org',
        createdBy: admin._id,
      },
      {
        name: 'Milo',
        species: 'Dog',
        breed: 'French Bulldog',
        age: 3,
        ageUnit: 'years',
        gender: 'Male',
        size: 'Medium',
        photos: [
          'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'Milo is a calm, affectionate little gentleman who loves couch snuggles and short strolls. Perfect companion for apartment living.',
        healthStatus: 'Great health, seasonal allergy managed',
        vaccinated: true,
        spayedNeutered: true,
        specialNeeds: false,
        adoptionFee: 200,
        status: 'Available',
        location: 'Oakland, CA',
        shelterContact: 'adoptions@pawsome.org',
        createdBy: admin._id,
      },
      {
        name: 'Oliver',
        species: 'Cat',
        breed: 'British Shorthair',
        age: 4,
        ageUnit: 'years',
        gender: 'Male',
        size: 'Medium',
        photos: [
          'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'Oliver is a plush, chubby-cheeked British Shorthair with a quiet dignity. Loves lounging in sunny spots and treats.',
        healthStatus: 'Healthy, up to date on all shots',
        vaccinated: true,
        spayedNeutered: true,
        specialNeeds: false,
        adoptionFee: 120,
        status: 'Available',
        location: 'San Jose, CA',
        shelterContact: 'adoptions@pawsome.org',
        createdBy: admin._id,
      },
      {
        name: 'Clover & Pip',
        species: 'Rabbit',
        breed: 'Holland Lop',
        age: 10,
        ageUnit: 'months',
        gender: 'Female',
        size: 'Small',
        photos: [
          'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'Clover is a sweet, velvety Holland Lop bunny who loves fresh cilantro, romaine lettuce, and gentle head strokes.',
        healthStatus: 'Fully healthy & litterbox trained',
        vaccinated: true,
        spayedNeutered: true,
        specialNeeds: false,
        adoptionFee: 65,
        status: 'Available',
        location: 'San Francisco, CA',
        shelterContact: 'adoptions@pawsome.org',
        createdBy: admin._id,
      },
      {
        name: 'Zeus',
        species: 'Dog',
        breed: 'German Shepherd',
        age: 3,
        ageUnit: 'years',
        gender: 'Male',
        size: 'Large',
        photos: [
          'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'Zeus is an intelligent, loyal, and athletic companion with basic obedience training. Looking for an active household with a yard.',
        healthStatus: 'Strong, energetic, fully vaccinated',
        vaccinated: true,
        spayedNeutered: true,
        specialNeeds: false,
        adoptionFee: 180,
        status: 'Pending',
        location: 'San Mateo, CA',
        shelterContact: 'adoptions@pawsome.org',
        createdBy: admin._id,
      },
      {
        name: 'Cleo',
        species: 'Cat',
        breed: 'Maine Coon Mix',
        age: 2,
        ageUnit: 'years',
        gender: 'Female',
        size: 'Large',
        photos: [
          'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'Cleo is a magnificent, fluffy gentle giant. She is exceptionally friendly, loves chirping conversations, and enjoys brush sessions.',
        healthStatus: 'Healthy & microchipped',
        vaccinated: true,
        spayedNeutered: true,
        specialNeeds: false,
        adoptionFee: 110,
        status: 'Available',
        location: 'Palo Alto, CA',
        shelterContact: 'adoptions@pawsome.org',
        createdBy: admin._id,
      },
      {
        name: 'Sunny',
        species: 'Bird',
        breed: 'Cockatiel',
        age: 1,
        ageUnit: 'years',
        gender: 'Male',
        size: 'Small',
        photos: [
          'https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'Sunny can whistle tunes, loves sitting on friendly shoulders, and enjoys seeds and fresh apple slices.',
        healthStatus: 'Avian vet checked, healthy plumage',
        vaccinated: false,
        spayedNeutered: false,
        specialNeeds: false,
        adoptionFee: 50,
        status: 'Available',
        location: 'San Francisco, CA',
        shelterContact: 'adoptions@pawsome.org',
        createdBy: admin._id,
      },
      {
        name: 'Daisy',
        species: 'Dog',
        breed: 'Beagle',
        age: 4,
        ageUnit: 'years',
        gender: 'Female',
        size: 'Medium',
        photos: [
          'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'Daisy has the sweetest soulful eyes and a heart of gold. She loves sniffing adventures in parks and cuddles on the rug.',
        healthStatus: 'Healthy, spayed, up to date on vaccines',
        vaccinated: true,
        spayedNeutered: true,
        specialNeeds: false,
        adoptionFee: 140,
        status: 'Adopted',
        location: 'Fremont, CA',
        shelterContact: 'adoptions@pawsome.org',
        createdBy: admin._id,
      },
      {
        name: 'Barnaby Jr',
        species: 'Rabbit',
        breed: 'Lionhead',
        age: 8,
        ageUnit: 'months',
        gender: 'Male',
        size: 'Small',
        photos: [
          'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'A bundle of soft fluff with a mane like a tiny lion. Inquisitive, docile, and loves munching on timothy hay.',
        healthStatus: 'Healthy, vet checked',
        vaccinated: true,
        spayedNeutered: true,
        specialNeeds: false,
        adoptionFee: 60,
        status: 'Available',
        location: 'Walnut Creek, CA',
        shelterContact: 'adoptions@pawsome.org',
        createdBy: admin._id,
      },
    ];

    const createdPets = await Pet.insertMany(petsData);

    console.log('📝 Creating sample adoption applications...');

    // Application 1: Approved application for Daisy (adopted)
    const daisyPet = createdPets.find((p) => p.name === 'Daisy');
    const zeusPet = createdPets.find((p) => p.name === 'Zeus');
    const barnabyPet = createdPets.find((p) => p.name === 'Barnaby');

    await Application.create({
      pet: daisyPet._id,
      applicant: user1._id,
      fullName: user1.name,
      email: user1.email,
      phone: user1.phone,
      address: user1.address,
      housingType: 'Rent House',
      hasYard: true,
      hasOtherPets: false,
      householdMembers: 2,
      petExperience: 'Experienced pet owner',
      reasonForAdoption:
        'We have owned beagles for over 10 years and have a fenced backyard ready for her.',
      status: 'approved',
      reviewNotes: 'Verified references and safe yard environment. Perfect match!',
      reviewedBy: admin._id,
      reviewedAt: new Date(Date.now() - 86400000 * 3),
    });

    // Application 2: Pending application for Zeus
    await Application.create({
      pet: zeusPet._id,
      applicant: user1._id,
      fullName: user1.name,
      email: user1.email,
      phone: user1.phone,
      address: user1.address,
      housingType: 'Rent House',
      hasYard: true,
      hasOtherPets: false,
      householdMembers: 2,
      petExperience: 'Experienced pet owner',
      reasonForAdoption:
        'Seeking an energetic companion for trail running and daily park play.',
      status: 'pending',
    });

    // Application 3: Pending application for Barnaby by Liam
    await Application.create({
      pet: barnabyPet._id,
      applicant: user2._id,
      fullName: user2.name,
      email: user2.email,
      phone: user2.phone,
      address: user2.address,
      housingType: 'Own House',
      hasYard: true,
      hasOtherPets: true,
      otherPetsDetails: 'One very calm senior cat who gets along with friendly dogs',
      householdMembers: 3,
      petExperience: 'Experienced pet owner',
      reasonForAdoption:
        'Our family would love to welcome Barnaby into our home. We work from home full time.',
      status: 'pending',
    });

    console.log('💬 Creating sample conversation and messages...');

    const conv = await Conversation.create({
      participants: [user1._id, admin._id],
      pet: barnabyPet._id,
      lastMessage: {
        text: 'Hi Emma! Barnaby loves weekend visits. You can come by between 10am and 4pm.',
        sender: admin._id,
        createdAt: new Date(),
      },
    });

    await Message.create({
      conversationId: conv._id,
      sender: user1._id,
      text: 'Hello! I saw Barnaby on the website. Is he available for a meet-and-greet this Saturday?',
      read: true,
      createdAt: new Date(Date.now() - 3600000 * 2),
    });

    await Message.create({
      conversationId: conv._id,
      sender: admin._id,
      text: 'Hi Emma! Barnaby loves weekend visits. You can come by between 10am and 4pm.',
      read: false,
      createdAt: new Date(Date.now() - 1800000),
    });

    console.log('🔔 Creating sample notifications...');

    await Notification.create({
      recipient: user1._id,
      sender: admin._id,
      type: 'application_status',
      title: '🎉 Application Approved: Daisy',
      message:
        'Congratulations! Your adoption application for Daisy has been approved by the shelter team.',
      data: { petId: daisyPet._id },
      read: false,
    });

    await Notification.create({
      recipient: admin._id,
      sender: user2._id,
      type: 'new_application',
      title: 'New Adoption Application',
      message: 'Liam Chen submitted an application for Barnaby (Golden Retriever).',
      data: { petId: barnabyPet._id },
      read: false,
    });

    console.log('🎉 Database seeding completed successfully!');
    console.log('----------------------------------------------------');
    console.log('🔑 TEST ACCOUNTS:');
    console.log('   Admin: admin@pawsome.org / Admin@123');
    console.log('   User 1: user@example.com / User@123');
    console.log('   User 2: liam@example.com / User@123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
