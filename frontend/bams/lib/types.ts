export type Countries = {
    code: string;
    name: string;
}[];

export type Courses = {
    id: number;
    name: string;
    code: string;
}[];

export type backEndErrors = {
    [key: string]: string[];
  };
  