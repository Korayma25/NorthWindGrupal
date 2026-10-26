import { ProblemDetails, ValidationError } from '../../domain/dtos';

export class AppHttpError extends Error {
  public readonly status: number;
  public readonly title?: string;
  public readonly detail?: string;
  public readonly fieldErrors: Record<string, string>;
  public readonly errorsList: readonly ValidationError[];
  public readonly problemDetails?: ProblemDetails;

  constructor(params: {
    message: string;
    status: number;
    title?: string;
    detail?: string;
    fieldErrors?: Record<string, string>;
    errorsList?: readonly ValidationError[];
    problemDetails?: ProblemDetails;
  }) {
    super(params.message);
    this.name = 'AppHttpError';
    this.status = params.status;
    this.title = params.title;
    this.detail = params.detail;
    this.fieldErrors = params.fieldErrors ?? {};
    this.errorsList = params.errorsList ?? [];
    this.problemDetails = params.problemDetails;
    Object.setPrototypeOf(this, AppHttpError.prototype);
  }
}
