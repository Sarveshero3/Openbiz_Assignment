import { z } from 'zod';

export const sendOtpSchema = z.object({
  aadhaarNumber: z.string().regex(/^\d{4}-\d{4}-\d{4}$/, {
    message: 'Aadhaar number must be in XXXX-XXXX-XXXX format'
  }),
  ownerName: z.string().min(3).max(100)
});

export const verifyAadhaarSchema = z.object({
  aadhaarNumber: z.string().regex(/^\d{4}-\d{4}-\d{4}$/),
  ownerName: z.string().min(3).max(100),
  otp: z.string().length(6, { message: 'OTP must be exactly 6 digits' })
});

export const verifyPanSchema = z.object({
  orgType: z.string().min(1, { message: 'Organisation type is required' }),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
    message: 'PAN must be a 10-character alphanumeric string (e.g., ABCDE1234F)'
  })
});

export const submitUdyamSchema = z.object({
  aadhaarNumber: z.string().regex(/^\d{4}-\d{4}-\d{4}$/),
  ownerName: z.string().min(3).max(100),
  aadhaarVerified: z.boolean(),
  orgType: z.string().min(1),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
  panOwnerName: z.string().min(3).max(100),
  panOwnerDOB: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  panVerified: z.boolean(),
  itrFiled: z.enum(['Yes', 'No']),
  gstinAvailable: z.enum(['Yes', 'No', 'Exempted'])
});

export type SendOtpDto = z.infer<typeof sendOtpSchema>;
export type VerifyAadhaarDto = z.infer<typeof verifyAadhaarSchema>;
export type VerifyPanDto = z.infer<typeof verifyPanSchema>;
export type SubmitUdyamDto = z.infer<typeof submitUdyamSchema>;
