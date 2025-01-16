 interface UserFormData {
    name: string;
    email: string;
    password: string;
    phone: string;
    authorization: string;
  }
  
  interface UploadedFile {
    type: 'document' | 'audio';
    uri: string;
    name: string;
  }

  interface Messages {
    id: string | number;
    title: string;
    content: string;
  }

  type AlertVariant = 'info' | 'success' | 'warning' | 'error';

  interface UserInfo{
    id: number;
    name: string;
    email: string;
    phone: string;
    authorization: string;
  }

  export{ UserFormData, UploadedFile, Messages, AlertVariant, UserInfo };