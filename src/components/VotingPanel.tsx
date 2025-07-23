import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Student, Candidate, VoteSubmission } from '@/types/voting';

interface VotingPanelProps {
  student: Student;
  onVoteSuccess: (votes: VoteSubmission) => void;
}

// Define position type more strictly
type Position = keyof VoteSubmission;

export function VotingPanel({ student, onVoteSuccess }: VotingPanelProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [votes, setVotes] = useState<VoteSubmission>({
    president_candidate_id: '',
    vice_president_candidate_id: '',
    secretary_candidate_id: '',
    treasurer_candidate_id: '',
    joint_treasurer_candidate_id: '',
    associate_secretary_candidate_id: '',
    joint_secretary_candidate_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  // Make positions array more type-safe
  const positions: Position[] = [
    'president_candidate_id',
    'vice_president_candidate_id',
    'secretary_candidate_id',
    'associate_secretary_candidate_id',
    'joint_secretary_candidate_id',
    'treasurer_candidate_id',
    'joint_treasurer_candidate_id'
  ];

  // Update position titles to match the actual keys
  const positionTitles: Record<Position, string> = {
    president_candidate_id: '🧑‍💼 President',
    vice_president_candidate_id: '🧑‍💼 Vice President',
    secretary_candidate_id: '🧑‍💼 Secretary',
    associate_secretary_candidate_id: '🧑‍💼 Associate Secretary',
    joint_secretary_candidate_id: '🧑‍💼 Joint Secretary',
    treasurer_candidate_id: '🧑‍💼 Treasurer',
    joint_treasurer_candidate_id: '🧑‍💼 Joint Treasurer'
  };

  // Helper function to get position name for candidate filtering
  const getPositionName = (positionKey: Position): string => {
    return positionKey.replace('_candidate_id', '');
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      setCandidates((data || []) as Candidate[]);
    } catch (err) {
      setError('Failed to load candidates. Please refresh the page.');
    }
  };

  const handleVoteChange = (position: Position, candidateId: string) => {
    setVotes(prev => ({
      ...prev,
      [position]: candidateId
    }));
  };

  const handleNext = () => {
    const currentPosition = positions[currentStep];
    if (!votes[currentPosition]) {
      setError(`Please select a candidate for ${positionTitles[currentPosition]}`);
      return;
    }
    setError('');
    if (currentStep < positions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setError('');
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all positions are voted for
    for (const position of positions) {
      if (!votes[position]) {
        setError(`Please select a candidate for ${positionTitles[position]}`);
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      // Submit vote
      const { error: voteError } = await supabase
        .from('votes')
        .insert({
          student_registration_number: student.registration_number,
          ...votes
        });

      if (voteError) throw voteError;

      // Update student's voting status
      const { error: updateError } = await supabase
        .from('students')
        .update({ has_voted: true })
        .eq('registration_number', student.registration_number);

      if (updateError) throw updateError;

      onVoteSuccess(votes);
    } catch (err) {
      setError('Failed to submit vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const groupedCandidates = candidates.reduce((acc, candidate) => {
    const position = candidate.position;
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(candidate);
    return acc;
  }, {} as Record<string, Candidate[]>);

  const currentPosition = positions[currentStep];
  const isLastStep = currentStep === positions.length - 1;
  const currentPositionName = getPositionName(currentPosition);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl">College Election 2025 - Voting Panel</CardTitle>
            <CardDescription className="text-center">
              Welcome, {student.registration_number}. Step {currentStep + 1} of {positions.length}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Role Title Card */}
        <Card className="mb-4">
          <CardHeader className="text-center py-6">
            <CardTitle className="text-3xl font-bold text-primary">
              {positionTitles[currentPosition]}
            </CardTitle>
            <CardDescription className="text-lg">
              Choose your preferred candidate for this position
            </CardDescription>
          </CardHeader>
        </Card>

        <form onSubmit={handleSubmit}>
          {/* Candidates Card */}
          <Card>
            <CardContent className="p-6">
              <RadioGroup
                value={votes[currentPosition]}
                onValueChange={(value) => handleVoteChange(currentPosition, value)}
              >
                <div className="space-y-3">
                  {groupedCandidates[currentPositionName]?.map((candidate) => (
                    <div key={candidate.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                      <RadioGroupItem value={candidate.id} id={candidate.id} className="mt-1" />
                      <Label htmlFor={candidate.id} className="flex items-center space-x-4 cursor-pointer flex-1">
                        <img
                          src={candidate.image_url}
                          alt={candidate.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-lg">{candidate.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Candidate for {positionTitles[currentPosition].replace('🧑‍💼 ', '')}
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              size="lg"
            >
              ← Previous
            </Button>
            
            {!isLastStep ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!votes[currentPosition]}
                size="lg"
              >
                Next →
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading || !votes[currentPosition]}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Submitting Vote...' : '🗳️ Submit Vote'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}