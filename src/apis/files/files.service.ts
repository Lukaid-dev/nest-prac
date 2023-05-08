import { Injectable } from "@nestjs/common";
import { Storage } from "@google-cloud/storage";
import { FileUpload } from "graphql-upload";
import { IFilesServiceUpload } from "./interfaces/files-service.interface";

interface IFileServiceUpload {
  file: FileUpload,
}

@Injectable()
export class FilesService {

  async upload({ files }: IFilesServiceUpload): Promise<string[]> {
    console.log(files);

    const waitedFiles = [];
    waitedFiles[0] = await files[0];
    waitedFiles[1] = await files[1];

    console.log(waitedFiles); // [File, File]


    // 1. 파일을 클라우드 스토이리에 저장하는 로직

    // 1-1. 스토리지 세팅하기
    const storage = new Storage({
        projectId: 'four-hours-5d3dd',
        keyFilename: 'four-hours-5d3dd-9bf717463252.json',
      }).bucket('four-hours-test');
    
    // 1-2. 스토리지에 파일 올리기
    console.time('시간을 확 인해보자!!');
    const results = [];
    for (let i = 0; i < waitedFiles.length; i++) {
      results[i] = await new Promise((resolve, reject) =>
        waitedFiles[i]
          .createReadStream()
          .pipe(storage.file(waitedFiles[i].filename).createWriteStream())
          .on('finish', () => resolve('성공'))
          .on('error', () => reject('실패')),
      );
    }
    console.timeEnd('시간을 확인해보자!!');

    return results;
  }
}
