export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  id: number;
  message: string;
}


export interface ContactMessageResponse {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}
