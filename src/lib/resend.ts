import { Resend } from "resend";
const resendInstance = new Resend(process.env.RESEND_API_KEY);
export default resendInstance;
