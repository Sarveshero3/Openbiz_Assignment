import { Request, Response } from 'express';
import { UdyamService } from './udyam.service';
import { sendOtpSchema, verifyAadhaarSchema, verifyPanSchema, submitUdyamSchema } from './udyam.schema';
import { ApiSuccessResponse } from '../../utils/errors';

const service = new UdyamService();

export class UdyamController {
  public sendOtp = async (req: Request, res: Response) => {
    const validated = sendOtpSchema.parse(req.body);
    const result = await service.sendOtp(validated);
    res.status(200).json(new ApiSuccessResponse(result.message));
  };

  public verifyAadhaar = async (req: Request, res: Response) => {
    const validated = verifyAadhaarSchema.parse(req.body);
    const result = await service.verifyAadhaar(validated);
    res.status(200).json(new ApiSuccessResponse('Aadhaar verification successful', result));
  };

  public verifyPan = async (req: Request, res: Response) => {
    const validated = verifyPanSchema.parse(req.body);
    const result = await service.verifyPan(validated);
    res.status(200).json(new ApiSuccessResponse('PAN verification successful', result));
  };

  public submit = async (req: Request, res: Response) => {
    const validated = submitUdyamSchema.parse(req.body);
    const result = await service.submit(validated);
    res.status(201).json(new ApiSuccessResponse('Submission completed successfully', result));
  };

  public getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await service.getById(id);
    res.status(200).json(new ApiSuccessResponse('Submission retrieved successfully', result));
  };
}
