export type Countries = {
  code: string;
  name: string;
}[];

export type Course = {
  id: number;
  name: string;
  code: string;
  description: string;
  tutors: number[];
  tutors_name: string;
};
export type Courses = Course[];

export type Class = {
  id: number;
  location: string;
  start_time: string;
  end_time: string;
  date: string;
  is_cancelled: boolean;
  cancelled_by: number;
  tutor: number;
  course: number;
  course_tutors: {
    id: number;
    name: string;
  }[];
};

export type Teachers = {
  id: number;
  name: string;
  designation: string;
}[];

export type backEndErrors = {
  [key: string]: string[];
};
