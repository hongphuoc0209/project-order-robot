import path from 'path';

export class PathUtils {
  static getDataPath(fileName: string): string {
    return path.resolve(__dirname, '../data', fileName);
  }
}