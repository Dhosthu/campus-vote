import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Student } from '@/types/voting';

interface AuthFormProps {
  onAuthSuccess: (student: Student) => void;
}

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [votingKey, setVotingKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check if student exists and key matches
      const { data: student, error: fetchError } = await supabase
        .from('students')
        .select('*')
        .eq('registration_number', registrationNumber)
        .eq('voting_key', votingKey)
        .single();

      if (fetchError || !student) {
        setError('Invalid registration number or voting key. Please try again.');
        setLoading(false);
        return;
      }

      if (student.has_voted) {
        setError('You have already voted.');
        setLoading(false);
        return;
      }

      onAuthSuccess(student);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">College Election 2025</CardTitle>
          <CardDescription>Enter your credentials to cast your vote</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="registration">Registration Number</Label>
              <Input
                id="registration"
                type="text"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="e.g., 310622104143"
                required
              />
            </div>
            <div>
              <Label htmlFor="key">Unique Voting Key</Label>
              <Input
                id="key"
                type="text"
                value={votingKey}
                onChange={(e) => setVotingKey(e.target.value)}
                placeholder="e.g., X7A92B"
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Login to Vote'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}