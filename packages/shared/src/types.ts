export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

export interface UserDTO {
  id: string;
  email: string;
  name?: string | null;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
}
