export type Room = {
  id: string;
  name?: string;
  data: {
    name?: string;
  };
};

export type Message = {
  uid: string;
  id: string;
  timestamp?: any;
  photo: string;
  video: string;
  name: string;
  url: string;
  message: string;
  caption?: string;
};
