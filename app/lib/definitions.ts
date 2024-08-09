export type Movie = {
  id: string;
  user_id: string;
  title: string;
  publishing_year: number;
  poster_url: string;
  created_at: string;
  updated_at: string;
  amount: number;
  date: string;
};

export type User = {
  id: string;
  name: string;
  role: string;
  email: string;
  created_at: string;
  updated_at: string;
};
