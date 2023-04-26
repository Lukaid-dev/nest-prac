import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException) {
    const status = exception.getStatus();
    const message = exception.getResponse();
    console.log("=======================")
    console.log('status : ', status);
    console.log('message : ', message);
    console.log("=======================")
  }

}