import { BadRequestException } from '@nestjs/common';
import { Workbook } from 'exceljs';
import * as tmp from 'tmp';

export const ToExcelFile = async (data: Array<any>, filename: string) => {
    const book = new Workbook();
    const sheet = book.addWorksheet('sheet1');
    const rows = data.map((d) => Object.values(d));
    rows.unshift(Object.keys(data[0]));
    sheet.addRows(rows);
    const file: string = await new Promise((resolve, reject) => {
      tmp.file(
        {
          discardDescriptor: true,
          prefix: filename,
          postfix: '.xlsx',
          mode: parseInt('0600', 8),
        },
        async (err, file: string) => {
          if (err) throw new BadRequestException(err);
  
          book.xlsx
            .writeFile(file)
            .then((_) => {
              resolve(file);
            })
            .catch((err) => {
              throw new BadRequestException(err);
            });
        },
      );
    });
  
    return file;
  };