import { BadRequestException, Logger } from "@nestjs/common";
import { Response } from 'express';

export interface ResDto<T> {
  code: string;

  desc: string;

  errorTrace?: any;

  type?: string;

  data?: T[];

  command?: T;

  timestamp?: Date;

  requestID?: string;

  pagination?: Pagination;

  result?: {
    key: string;
    value: string;
    error?: string;
    errorCode?: string;
  }[];
}

export interface Pagination {
  page: number;
  size: number;
  totalCount?: number;
  totalPage?: number;
}

export interface ComboBox {
  label: string;
  value: string;
}

export const ToCombo = (key: string, text: string): ComboBox => ({
  label: text,
  value: key,
});

export function ResOK<T>(data: T[], pagination?: Pagination): ResDto<T> {
  return {
    code: '200',
    desc: 'success',
    data,
    pagination,
    timestamp: new Date()
  };
}

export function Res(): ResDto<any> {
  return {
    code: '200',
    desc: 'success',
    timestamp: new Date()
  };
}

export function DeleteResponse(): ResDto<any> {
  return {
    code: '200',
    desc: 'Success deleting item',
    timestamp: new Date()
  };
}

export function NotFoundResponse(): ResDto<any> {
  return {
    code: '200',
    desc: 'Item not found',
    timestamp: new Date()
  };
}

export function ResAccepted(p:{key: string, value:string}[], reqId?: string): ResDto<any> {
  return {
    code: '202',
    desc: 'command submitted',
    result: p,
    requestID: reqId,
    timestamp: new Date()
  };
}

export function ResNotFound(p: { key: string; value: string }[]): ResDto<any> {
  return {
    code: '404',
    desc: 'not found',
    result: p.map((v) => ({ ...v, error: 'not found', errorCode: '404' })),
  };
}

export function ResOKCreated(
  p: {
    key: string;
    value: string;
    error?: string;
    errorCode?: string;
  }[],
  reqID?: string,
): ResDto<any> {
  return {
    code: '201',
    desc: 'succesffully',
    result: p,
    timestamp: new Date(),
    requestID: reqID
  };
}

export function ResOKCreated2(
  p: {
    key: string;
    value: string;
    error: string;
    errorCode: string;
  }[],
  code = '201'
): ResDto<any> {
  return {
    code,
    desc: 'succesffully',
    result: p,
    timestamp: new Date()
  };
}

export function ResBadRequest(
  exception: BadRequestException
): ResDto<any> {
  const res: any = exception.getResponse();
  const status = exception.getStatus();
  let errors: {
    key: string;
    value: string;
    error?: string;
    errorCode?: string;
  }[] = [];
  

  if(res.message instanceof Array) {
    (<Array<string>>res.message).map(v => {
      const s = v.split(' ');
      errors.push({ key: s[0], value: '', error: v })
    });
  }

  return {
    code: String(status),
    desc: exception.message,
    type: 'Validation Failed',
    result: errors,
  };
}

export function ResError(message: string, trace?: any): ResDto<any> {
  return {
    code: '500',
    desc: message,
    errorTrace: trace,
    timestamp: new Date(),
  };
}

export const ReplyError = (err: any, logger: Logger, reply: Response) => {
  logger.error(err);
  if (err instanceof BadRequestException) reply.status(400).json(ResBadRequest(err));
  else reply.status(500).json(ResError(err));
};
