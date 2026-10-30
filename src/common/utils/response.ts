import {Response} from 'express'; export const ok=(res:Response,data:unknown,status=200,message='Success')=>res.status(status).json({success:true,message,data});
