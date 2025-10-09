export interface SendEmailRequest {
    from:string;
    to:string;
    cc?:string;
    subject:string;
    body:string;
    conversationSid:string;
    conversationMessageSid:string;
  }
  