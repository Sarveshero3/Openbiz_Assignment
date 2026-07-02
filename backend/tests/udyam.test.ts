import request from 'supertest';
import app from '../src/app';
import { sendOtpSchema, verifyAadhaarSchema, verifyPanSchema, submitUdyamSchema } from '../src/app/udyam/udyam.schema';

// Mock variables must be prefixed with 'mock' to be accessible in jest.mock
const mockCreate = jest.fn();
const mockFindUnique = jest.fn();

jest.mock('../src/config/db', () => ({
  prisma: {
    $connect: jest.fn(),
    udyamSubmission: {
      create: (...args: any[]) => mockCreate(...args),
      findUnique: (...args: any[]) => mockFindUnique(...args)
    }
  }
}));

beforeEach(() => {
  jest.clearAllMocks();
  
  mockCreate.mockResolvedValue({
    id: 'mocked-uuid-1234',
    aadhaarNumber: '1234-5678-9012',
    ownerName: 'Sarvesh Kumar',
    aadhaarVerified: true,
    orgType: 'Proprietary',
    panNumber: 'ABCDE1234F',
    panOwnerName: 'Sarvesh Kumar',
    panOwnerDOB: new Date('1995-05-15'),
    panVerified: true,
    itrFiled: 'Yes',
    gstinAvailable: 'No',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  mockFindUnique.mockResolvedValue({
    id: 'mocked-uuid-1234',
    aadhaarNumber: '1234-5678-9012',
    ownerName: 'Sarvesh Kumar',
    aadhaarVerified: true,
    orgType: 'Proprietary',
    panNumber: 'ABCDE1234F',
    panOwnerName: 'Sarvesh Kumar',
    panOwnerDOB: new Date('1995-05-15'),
    panVerified: true,
    itrFiled: 'Yes',
    gstinAvailable: 'No',
    createdAt: new Date(),
    updatedAt: new Date()
  });
});

describe('Udyam Clone Validation Logic', () => {
  describe('Aadhaar Validation Rules', () => {
    it('should validate a correct Aadhaar number in format XXXX-XXXX-XXXX', () => {
      const result = sendOtpSchema.safeParse({
        aadhaarNumber: '1234-5678-9012',
        ownerName: 'John Doe'
      });
      expect(result.success).toBe(true);
    });

    it('should fail on too short Aadhaar number', () => {
      const result = sendOtpSchema.safeParse({
        aadhaarNumber: '1234-5678-901',
        ownerName: 'John Doe'
      });
      expect(result.success).toBe(false);
    });

    it('should fail on Aadhaar number with letters', () => {
      const result = sendOtpSchema.safeParse({
        aadhaarNumber: '1234-5678-901A',
        ownerName: 'John Doe'
      });
      expect(result.success).toBe(false);
    });

    it('should fail on unformatted Aadhaar number without hyphens', () => {
      const result = sendOtpSchema.safeParse({
        aadhaarNumber: '123456789012',
        ownerName: 'John Doe'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('PAN Validation Rules', () => {
    it('should validate a correct 10-character alphanumeric PAN string', () => {
      const result = verifyPanSchema.safeParse({
        orgType: 'Proprietary',
        panNumber: 'ABCDE1234F'
      });
      expect(result.success).toBe(true);
    });

    it('should fail on incorrectly formatted PAN number', () => {
      const result = verifyPanSchema.safeParse({
        orgType: 'Proprietary',
        panNumber: 'ABCD12345F'
      });
      expect(result.success).toBe(false);
    });

    it('should fail on short PAN number', () => {
      const result = verifyPanSchema.safeParse({
        orgType: 'Proprietary',
        panNumber: 'ABCDE1234'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Empty / Missing Fields', () => {
    it('should fail on empty ownerName in Aadhaar validation', () => {
      const result = sendOtpSchema.safeParse({
        aadhaarNumber: '1234-5678-9012',
        ownerName: ''
      });
      expect(result.success).toBe(false);
    });

    it('should fail on missing orgType in PAN validation', () => {
      const result = verifyPanSchema.safeParse({
        orgType: '',
        panNumber: 'ABCDE1234F'
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('Udyam Clone Endpoints', () => {
  describe('POST /api/v1/udyam/verify-pan', () => {
    it('should return 200 on valid inputs', async () => {
      const res = await request(app)
        .post('/api/v1/udyam/verify-pan')
        .send({
          orgType: 'Proprietary',
          panNumber: 'ABCDE1234F'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.panVerified).toBe(true);
    });

    it('should return 400 on invalid PAN format', async () => {
      const res = await request(app)
        .post('/api/v1/udyam/verify-pan')
        .send({
          orgType: 'Proprietary',
          panNumber: 'INVALID_PAN'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/udyam/submit', () => {
    const validSubmission = {
      aadhaarNumber: '1234-5678-9012',
      ownerName: 'Sarvesh Kumar',
      aadhaarVerified: true,
      orgType: 'Proprietary',
      panNumber: 'ABCDE1234F',
      panOwnerName: 'Sarvesh Kumar',
      panOwnerDOB: '1995-05-15',
      panVerified: true,
      itrFiled: 'Yes',
      gstinAvailable: 'No'
    };

    it('should return 201 on valid submission', async () => {
      const res = await request(app)
        .post('/api/v1/udyam/submit')
        .send(validSubmission);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('mocked-uuid-1234');
    });

    it('should return 400 on empty ownerName or missing fields', async () => {
      const res = await request(app)
        .post('/api/v1/udyam/submit')
        .send({
          ...validSubmission,
          ownerName: ''
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
