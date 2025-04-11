import request from "supertest";
import app from "../src/index";
import { User } from "../src/models/User";
import { Link } from "../src/models/Links";
import jwt from "jsonwebtoken";

describe('Link Routes', () => {
    let token: string;
    let userId: string;
  
    beforeEach(async () => {
      const hashedPassword = await import('bcryptjs').then((bcrypt) =>
        bcrypt.hash('password123', 10)
      );
      const user = await new User({
        email: 'test@example.com',
        password: hashedPassword,
        // Optional fields can be omitted
      }).save();
      userId = user._id!.toString();
      token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    });
  
    describe('POST /api/links', () => {
      it('should create a new link', async () => {
        const response = await request(app)
          .post('/api/links') // Fixed route path
          .set('Authorization', `Bearer ${token}`)
          .send({
            url: 'https://example.com',
            platform: 'youtube',
          });
  
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('link');
        expect(response.body.link.url).toBe('https://example.com');
        expect(response.body.link.platform).toBe('youtube'); // Fixed: Check link.platform
  
        const link = await Link.findOne({ owner: userId });
        expect(link).toBeTruthy();
        expect(link?.url).toBe('https://example.com');
        expect(link?.platform).toBe('youtube');
      });
  
      it('should return 401 if no token is provided', async () => {
        const response = await request(app)
          .post('/api/links') // Fixed route path
          .send({
            url: 'https://example.com',
            platform: 'youtube',
          });
  
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'No token provided' });
      });
  
      it('should return 401 if token is invalid', async () => {
        const response = await request(app)
          .post('/api/links') // Fixed route path
          .set('Authorization', 'Bearer invalid-token')
          .send({
            url: 'https://example.com',
            platform: 'youtube',
          });
  
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Invalid token' });
      });
    });
  
    describe('GET /api/links', () => {
      it('should retrieve links for the authenticated user', async () => {
        await new Link({
          url: 'https://example.com',
          platform: 'youtube',
          owner: userId,
        }).save();
  
        const response = await request(app)
          .get('/api/links?page=1&limit=10') // Fixed route path
          .set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].url).toBe('https://example.com');
        expect(response.body[0].platform).toBe('youtube');
      });
  
      it('should return 401 if no token is provided', async () => {
        const response = await request(app).get('/api/links?page=1&limit=10'); // Fixed route path
  
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'No token provided' });
      });
    });
  });
