export interface TokensDto {
  readonly accessToken: string;
}

export interface UserCredentialsDto {
  readonly email: string;
  readonly password: string;
}

export interface UserRegistrationDto {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
}
