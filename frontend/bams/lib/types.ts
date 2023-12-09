export type Countries = {
    code: string;
    name: string;
}[];

export type Courses = {
    id: number;
    name: string;
    code: string;
    description: string;
    tutors:number;
    tutors_name: string
}[];

export type Teachers = {
    id: number;
    name: string;
    designation: string;
}[];


export type backEndErrors = {
    [key: string]: string[];
  };
  