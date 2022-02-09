export interface ResponseType {
  meta: { status: number; statusText: string };
}

export interface ApiStatusResponseType extends ResponseType {
  data: {
    version: number;
    timestamp: string;
    online: boolean;
  };
}

export interface RegisterUserResponseType extends ResponseType {
  data: {
    userId: string;
    userSecret: string;
  };
}

export interface DeleteUserResponseType extends ResponseType {
  data: {
    status: string;
    userId: string;
  };
}
