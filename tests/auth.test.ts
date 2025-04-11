import request from 'supertest';
import app from '../src/index';
import { User } from '../src/models/User';

describe('Auth Routes', () => {
  describe('POST /api/user/register', () => {
    it('should register a new user', async () => {
      const response = await request(app).post('/api/user/register').send({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        profileImg: 'https://example.com/profile.jpg',
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'User registered successfully',
      });

      const user = await User.findOne({ email: 'test@example.com' });
      expect(user).toBeTruthy();
      expect(user?.email).toBe('test@example.com');
      expect(user?.firstName).toBe('John');
    });

    it('should return 400 if user already exists', async () => {
      await new User({
        email: 'test@example.com',
        password: 'hashedpassword',
        // Optional fields can be omitted
      }).save();

      const response = await request(app).post('/api/user/register').send({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        profileImg: 'https://example.com/profile.jpg',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'User already exists' });
    });

    it('should return 500 if invalid data is provided', async () => {
      const response = await request(app).post('/api/user/register').send({
        email: 'invalid-email', // Invalid email format
        password: 'pass', // Too short
        firstName: '',
        lastName: '',
        profileImg: '',
      });

      expect(response.status).toBe(500); // Zod validation will throw an error
    });
  });

  describe('POST /api/user/login', () => {
    it('should login a user and return a token', async () => {
      const hashedPassword = await import('bcryptjs').then((bcrypt) =>
        bcrypt.hash('password123', 10)
      );
      await new User({
        email: 'test@example.com',
        password: hashedPassword,
        // Optional fields can be omitted
      }).save();

      const response = await request(app).post('/api/user/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 400 for invalid credentials', async () => {
      const response = await request(app).post('/api/user/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Invalid credentials' });
    });
  });
});