export interface DeveloperInfo {
    id?: number;
    fullName: string;
    jobRole: string;
    emailAddress: string;
    phoneNumber: string;
    linkedInProfileURL: string;
    message: string;
    country: string;
    city: string;
    cvFile: File | null; 
  }