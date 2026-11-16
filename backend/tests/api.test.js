const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app } = require('../src/server');
const User = require('../src/models/User');
const Pet = require('../src/models/Pet');
const Application = require('../src/models/Application');

jest.setTimeout(120000);

let mongoServer;
let adminToken;
let userToken;
let testPetId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Register Admin
  const adminRes = await request(app).post('/api/auth/register').send({
    name: 'Admin Test',
    email: 'admin.test@example.com',
    password: 'Password123',
    role: 'admin',
  });
  adminToken = adminRes.body.token;

  // Register Regular User
  const userRes = await request(app).post('/api/auth/register').send({
    name: 'User Test',
    email: 'user.test@example.com',
    password: 'Password123',
    role: 'user',
  });
  userToken = userRes.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('1. Health Check Endpoint', () => {
  it('GET /api/health should return 200 and healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('healthy');
  });
});

describe('2. Authentication & Authorization API', () => {
  it('POST /api/auth/login with valid credentials should succeed', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'user.test@example.com',
      password: 'Password123',
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('user.test@example.com');
  });

  it('POST /api/auth/login with invalid password should return 401', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'user.test@example.com',
      password: 'WrongPassword',
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/auth/me with valid Bearer token should return user data', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.user.name).toBe('User Test');
  });

  it('GET /api/auth/me without token should return 401 Unauthorized', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toEqual(401);
  });
});

describe('3. Pet Management API', () => {
  it('POST /api/pets as regular user should return 403 Forbidden', async () => {
    const res = await request(app)
      .post('/api/pets')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Forbidden Dog',
        species: 'Dog',
        breed: 'Pug',
        age: 2,
        gender: 'Male',
        size: 'Small',
        photos: ['https://example.com/pug.jpg'],
        description: 'Test pet',
      });
    expect(res.statusCode).toEqual(403);
  });

  it('POST /api/pets as admin should successfully create a pet', async () => {
    const res = await request(app)
      .post('/api/pets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Rocky',
        species: 'Dog',
        breed: 'Labrador Retriever',
        age: 3,
        gender: 'Male',
        size: 'Large',
        photos: ['https://example.com/rocky.jpg'],
        description: 'Loving friendly labrador looking for a good home.',
        adoptionFee: 100,
        status: 'Available',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.pet.name).toBe('Rocky');
    testPetId = res.body.pet._id;
  });

  it('GET /api/pets should list pets with pagination', async () => {
    const res = await request(app).get('/api/pets');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.pets)).toBe(true);
    expect(res.body.pets.length).toBeGreaterThan(0);
  });

  it('GET /api/pets/:id should return single pet details', async () => {
    const res = await request(app).get(`/api/pets/${testPetId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.pet._id).toBe(testPetId);
  });
});

describe('4. Adoption Applications API', () => {
  let createdAppId;

  it('POST /api/applications as logged-in user should submit application', async () => {
    const res = await request(app)
      .post('/api/applications')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        petId: testPetId,
        fullName: 'Applicant Tester',
        email: 'user.test@example.com',
        phone: '+1 555 123 4567',
        address: '123 Test St, Test City',
        housingType: 'Own House',
        hasYard: true,
        reasonForAdoption: 'We have lots of space and time to take care of Rocky.',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    createdAppId = res.body.application._id;
  });

  it('GET /api/applications/my should list user applications', async () => {
    const res = await request(app)
      .get('/api/applications/my')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.applications.length).toBeGreaterThan(0);
  });

  it('PATCH /api/applications/:id/status as admin should approve application and update pet status', async () => {
    const res = await request(app)
      .patch(`/api/applications/${createdAppId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'approved',
        reviewNotes: 'Great home environment confirmed!',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.application.status).toBe('approved');

    // Verify pet status became 'Adopted'
    const petRes = await request(app).get(`/api/pets/${testPetId}`);
    expect(petRes.body.pet.status).toBe('Adopted');
  });
});
