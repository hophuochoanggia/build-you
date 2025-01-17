export interface IProposingScheduleTime {
  id?: string;
  proposal: string | Date; // proposal time
  index?: number;
  metingUrl?: string;
  schedule?: string;
  note?: string;
}

export interface IScheduleProposal {
  id: string;
  challenge: string;
  status: string;
  proposals: IProposalTime[];
  phase: string;
  check: number;
}

export interface IProposalTime {
  id: string;
  schedule: string;
  user: string;
  proposal: string;
  isConfirmed: number;
  isVotedByCurrentUser: boolean;
  votes: number;
  metingUrl: string;
  votedBy: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProposedScheduleTime {
  schedule: {
    check: null | number;
    createdAt: string;
    id: string;
    meetingUrl: null;
    phase: "intake" | "check" | "closing";
    stato: string;
    updatedAt: string;
  };
  proposals: IProposalTime[];
}

export interface IScheduledTime {
  check: null | number;
  createdAt: string;
  deletedAt: string | null;
  id: string;
  meetingUrl: string;
  note: string;
  phase: "intake" | "check" | "closing" | null;
  schedule: string;
  updatedAt: string;
}
