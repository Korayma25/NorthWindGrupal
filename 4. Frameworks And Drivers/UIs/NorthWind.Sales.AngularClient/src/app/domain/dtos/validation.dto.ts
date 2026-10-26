export interface ValidationError {
  readonly propertyName: string;
  readonly message: string;
}

export interface ProblemDetails {
  readonly type?: string;
  readonly title?: string;
  readonly status?: number;
  readonly detail?: string;
  readonly instance?: string;
  readonly errors?: readonly ValidationError[];
  readonly [key: string]: unknown;
}
