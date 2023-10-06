import { EntityNotFoundExceptionFilter } from './entity-not-found-excpetion.filter';
import { EntityNotFoundError } from 'typeorm';
import { ArgumentsHost, HttpStatus } from '@nestjs/common';

describe('EntityNotFoundExceptionFilter', () => {
  let filter: EntityNotFoundExceptionFilter;

  beforeEach(() => {
    filter = new EntityNotFoundExceptionFilter();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should catch EntityNotFoundError and set response status and message', () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    const mockRequest = {}; // Mock request if needed

    const mockHttpArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    };

    const error = new EntityNotFoundError('Entity not found', 'ENTITY_NOT_FOUND_CODE');

    filter.catch(error, mockHttpArgumentsHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Not found',
    });
  });
});
