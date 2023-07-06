export interface ICreateChallenge {
  goal: string;
  benefits: string;
  reasons: string;
  achievementTime: Date;
}

export interface ICreateCompanyChallenge {
  goal: string;
  benefits: string;
  reasons: string;
  achievementTime: Date | undefined;
  maximumPeople: number | undefined;
  public: boolean;
  image?: string;
}

export interface IEditChallenge {
  goal: string;
  benefits: string;
  reasons: string;
  achievementTime: string;
}

export interface IUpdateChallengeImage {
  id: string;
}

export interface IProgressChallenge {
  id: string;
  // user: string; missing from api but we can get
  challenge?: {
    id: string;
    goal: string;
  };
  caption: string;
  image: string | null;
  video: string | null;
  location: string;
  createdAt: string;
  likes?: any[];
  comments?: any[];
  first?: boolean; 
}

export interface IChallenge {
  id: string;
  goal: string;
  name: string;
  owner: {
    id: string;
    avatar: string;
    name: string;
    surname: string;
  }[];
  benefits: string;
  reasons: string;
  achievementTime: Date;
  image?: string | null;
  status?: string;
  public?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  progress?: IProgressChallenge[];
}
