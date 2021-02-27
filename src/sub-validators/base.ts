export class ValidationResult {
  constructor(
    public path: string,
    public isError: boolean,
    public errorMessage?: string
  ) {}
}

export interface SubValidator {
  validate: (obj: any) => boolean;
  errorMessage?: string;
}
