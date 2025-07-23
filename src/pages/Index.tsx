import { useState } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { VotingPanel } from '@/components/VotingPanel';
import { SuccessPage } from '@/components/SuccessPage';
import { Student, VoteSubmission } from '@/types/voting';

type AppState = 'auth' | 'voting' | 'success';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('auth');
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [submittedVotes, setSubmittedVotes] = useState<VoteSubmission | null>(null);

  const handleAuthSuccess = (student: Student) => {
    setCurrentStudent(student);
    setAppState('voting');
  };

  const handleVoteSuccess = (votes: VoteSubmission) => {
    setSubmittedVotes(votes);
    setAppState('success');
  };

  const handleReturnHome = () => {
    setAppState('auth');
    setCurrentStudent(null);
    setSubmittedVotes(null);
  };

  if (appState === 'auth') {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  if (appState === 'voting' && currentStudent) {
    return <VotingPanel student={currentStudent} onVoteSuccess={handleVoteSuccess} />;
  }

  if (appState === 'success' && submittedVotes) {
    return <SuccessPage votes={submittedVotes} onReturnHome={handleReturnHome} />;
  }

  return null;
};

export default Index;
