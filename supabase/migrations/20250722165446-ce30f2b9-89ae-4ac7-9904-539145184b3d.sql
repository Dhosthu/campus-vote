-- Create students table
CREATE TABLE public.students (
  registration_number TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  voting_key TEXT NOT NULL,
  has_voted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create candidates table
CREATE TABLE public.candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL CHECK (position IN (
    'president', 
    'vice_president', 
    'secretary',
    'treasurer',
    'joint_treasurer',
    'associate_secretary',
    'joint_secretary'
  )),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_registration_number TEXT NOT NULL REFERENCES public.students(registration_number),
  president_candidate_id UUID REFERENCES public.candidates(id),
  vice_president_candidate_id UUID REFERENCES public.candidates(id),
  secretary_candidate_id UUID REFERENCES public.candidates(id),
  treasurer_candidate_id UUID REFERENCES public.candidates(id),
  joint_treasurer_candidate_id UUID REFERENCES public.candidates(id),
  associate_secretary_candidate_id UUID REFERENCES public.candidates(id),
  joint_secretary_candidate_id UUID REFERENCES public.candidates(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample students
INSERT INTO public.students (registration_number, email, voting_key) VALUES
('310622104143', 'student1@example.com', 'X7A92B'),
('310622104119', 'student2@example.com', 'P4L8TY'),
('310622104140', 'student3@example.com', 'QZ918K'),
('310622104020', 'student4@example.com', 'MG22XL');

-- Insert sample candidates
INSERT INTO public.candidates (name, position, image_url) VALUES
-- President candidates
('Alice Johnson', 'president', 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'),
('Bob Smith', 'president', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'),
('Carol Davis', 'president', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'),

-- Vice President candidates
('David Wilson', 'vice_president', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'),
('Emma Brown', 'vice_president', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'),
('Frank Miller', 'vice_president', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'),

-- Secretary candidates
('Grace Lee', 'secretary', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face'),
('Henry Taylor', 'secretary', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'),
('Ivy Chen', 'secretary', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'),

-- Treasurer candidates
('Jack Anderson', 'treasurer', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face'),
('Karen White', 'treasurer', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face'),

-- Joint Treasurer candidates
('Liam Clark', 'joint_treasurer', 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&fit=crop&crop=face'),
('Mia Roberts', 'joint_treasurer', 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&h=150&fit=crop&crop=face'),

-- Associate Secretary candidates
('Noah Walker', 'associate_secretary', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'),
('Olivia Green', 'associate_secretary', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'),

-- Joint Secretary candidates
('Peter Hall', 'joint_secretary', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'),
('Quinn Adams', 'joint_secretary', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face');

-- Enable Row Level Security (though we'll handle auth manually)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (since we're handling auth manually)
CREATE POLICY "Allow public read access to students" ON public.students FOR ALL USING (true);
CREATE POLICY "Allow public read access to candidates" ON public.candidates FOR ALL USING (true);
CREATE POLICY "Allow public access to votes" ON public.votes FOR ALL USING (true);