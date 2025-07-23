export interface Student {
  registration_number: string;
  email: string;
  voting_key: string;
  has_voted: boolean;
  created_at: string;
}

export interface Candidate {
  id: string;
  name: string;
  position: 'president' | 'vice_president' | 'secretary' | 'treasurer' | 'joint_treasurer' | 'associate_secretary' | 'joint_secretary';
  image_url: string;
  created_at: string;
}

export interface Vote {
  id: string;
  student_registration_number: string;
  president_candidate_id: string | null;
  vice_president_candidate_id: string | null;
  secretary_candidate_id: string | null;
  treasurer_candidate_id: string | null;
  joint_treasurer_candidate_id: string | null;
  associate_secretary_candidate_id: string | null;
  joint_secretary_candidate_id: string | null;
  created_at: string;
}

export interface VoteSubmission {
  president_candidate_id: string;
  vice_president_candidate_id: string;
  secretary_candidate_id: string;
  treasurer_candidate_id: string;
  joint_treasurer_candidate_id: string;
  associate_secretary_candidate_id: string;
  joint_secretary_candidate_id: string;
}