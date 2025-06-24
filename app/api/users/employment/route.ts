import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-config';

// Add this line to make the route compatible with static exports
export const dynamic = 'force-static';

const VALID_EMPLOYMENT_STATUSES = ['EMPLOYED', 'SELF_EMPLOYED', 'UNEMPLOYED', 'STUDENT', 'RETIRED'];

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return createErrorResponse('Authorization header is required', 401);
    }

    const body = await request.json();

    // Validate employment status
    if (!VALID_EMPLOYMENT_STATUSES.includes(body.employmentStatus)) {
      return createErrorResponse(`Employment status must be one of: ${VALID_EMPLOYMENT_STATUSES.join(', ')}`, 400);
    }

    // For non-employed statuses, only send the status
    if (body.employmentStatus !== 'EMPLOYED') {
      const payload = {
        employmentStatus: body.employmentStatus
      };

      const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://litefi-backend.onrender.com'}/users/employment`, {
        method: 'PATCH',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await backendResponse.json();

      if (!backendResponse.ok) {
        return createErrorResponse(
          responseData.message || 'Failed to update employment information',
          backendResponse.status
        );
      }

      return createSuccessResponse('Employment information updated successfully', responseData);
    }

    // Additional validation for employed status
    const errors = [];

    // Required fields validation
    const requiredFields = [
      'employer', 
      'jobTitle', 
      'workEmail', 
      'workPhone', 
      'monthlySalary',
      'employerAddress',
      'employerStreet',
      'employerCity',
      'employerState',
      'employerCountry',
      'startDate',
      'salaryPaymentDate'
    ];
    
    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      errors.push(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Monthly salary validation
    if (body.monthlySalary !== undefined && (isNaN(body.monthlySalary) || body.monthlySalary <= 0)) {
      errors.push('Monthly salary must be positive');
    }

    // Date format validation (dd/mm/yyyy)
    if (body.startDate) {
      const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      if (!datePattern.test(body.startDate)) {
        errors.push('Invalid date format. Use dd/mm/yyyy');
      }
    }

    // Salary payment date validation (1-31)
    if (body.salaryPaymentDate !== undefined) {
      const paymentDate = Number(body.salaryPaymentDate);
      if (isNaN(paymentDate) || paymentDate < 1 || paymentDate > 31) {
        errors.push('Salary payment date must be between 1 and 31');
      }
    }

    // Return all validation errors at once
    if (errors.length > 0) {
      return new Response(
        JSON.stringify({
          statusCode: 400,
          message: errors,
          error: 'BadRequestException',
          timestamp: new Date().toISOString()
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // If validation passes, send to backend
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://litefi-backend.onrender.com'}/users/employment`, {
      method: 'PATCH',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      return createErrorResponse(
        responseData.message || 'Failed to update employment information',
        backendResponse.status
      );
    }

    return createSuccessResponse('Employment information updated successfully', responseData);
  } catch (error) {
    console.error('Employment update error:', error);
    return createErrorResponse('Internal server error', 500);
  }
} 