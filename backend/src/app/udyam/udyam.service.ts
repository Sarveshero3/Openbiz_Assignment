import { prisma } from '../../config/db';
import { SendOtpDto, VerifyAadhaarDto, VerifyPanDto, SubmitUdyamDto } from './udyam.schema';
import { BadRequestError, NotFoundError } from '../../utils/errors';
import { logger } from '../../utils/logger';

// ponytail: in-memory OTP cache, use Redis or database storage if running multi-instance production backend
const otpCache = new Map<string, string>();

// ponytail: in-memory submissions store if PostgreSQL DB connection fails
const submissionsDbMock: any[] = [];

export class UdyamService {
  public async sendOtp(dto: SendOtpDto) {
    const otp = '123456'; // ponytail: hardcoded OTP for easy simulation and automated testing
    otpCache.set(dto.aadhaarNumber, otp);
    logger.info(`Simulated sending OTP ${otp} to Aadhaar ${dto.aadhaarNumber}`);
    return { message: 'OTP sent successfully to registered mobile number' };
  }

  public async verifyAadhaar(dto: VerifyAadhaarDto) {
    const cachedOtp = otpCache.get(dto.aadhaarNumber);
    if (!cachedOtp || cachedOtp !== dto.otp) {
      throw new BadRequestError('Invalid or expired OTP');
    }
    // Clear OTP after successful verification
    otpCache.delete(dto.aadhaarNumber);
    return {
      aadhaarNumber: dto.aadhaarNumber,
      ownerName: dto.ownerName,
      aadhaarVerified: true
    };
  }

  public async verifyPan(dto: VerifyPanDto) {
    // Simulating validation success. In real life we connect to NSDL/CBDT.
    return {
      panNumber: dto.panNumber.toUpperCase(),
      orgType: dto.orgType,
      panVerified: true
    };
  }

  public async submit(dto: SubmitUdyamDto) {
    const parsedDob = new Date(dto.panOwnerDOB);
    if (isNaN(parsedDob.getTime())) {
      throw new BadRequestError('Invalid date format for DOB/DOI');
    }

    try {
      const submission = await prisma.udyamSubmission.create({
        data: {
          aadhaarNumber: dto.aadhaarNumber,
          ownerName: dto.ownerName,
          aadhaarVerified: dto.aadhaarVerified,
          orgType: dto.orgType,
          panNumber: dto.panNumber.toUpperCase(),
          panOwnerName: dto.panOwnerName,
          panOwnerDOB: parsedDob,
          panVerified: dto.panVerified,
          itrFiled: dto.itrFiled,
          gstinAvailable: dto.gstinAvailable
        }
      });
      return submission;
    } catch (dbError) {
      logger.warn('PostgreSQL database not available. Falling back to in-memory submission store.');
      const submission = {
        id: `mock-db-${Math.random().toString(36).substring(2, 11)}`,
        aadhaarNumber: dto.aadhaarNumber,
        ownerName: dto.ownerName,
        aadhaarVerified: dto.aadhaarVerified,
        orgType: dto.orgType,
        panNumber: dto.panNumber.toUpperCase(),
        panOwnerName: dto.panOwnerName,
        panOwnerDOB: parsedDob,
        panVerified: dto.panVerified,
        itrFiled: dto.itrFiled,
        gstinAvailable: dto.gstinAvailable,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      submissionsDbMock.push(submission);
      return submission;
    }
  }

  public async getById(id: string) {
    try {
      const submission = await prisma.udyamSubmission.findUnique({
        where: { id }
      });
      if (submission) return submission;
    } catch (dbError) {
      logger.warn('PostgreSQL database not available. Searching in-memory submission store.');
    }

    const memorySubmission = submissionsDbMock.find(s => s.id === id);
    if (!memorySubmission) {
      throw new NotFoundError(`Submission with ID ${id} not found`);
    }

    return memorySubmission;
  }
}
