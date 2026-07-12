-- Create schemes table
CREATE TABLE public.schemes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  ministry_department TEXT NOT NULL,
  category TEXT NOT NULL, -- education, agriculture, finance, health, women, etc.
  state TEXT, -- null for central schemes
  description TEXT NOT NULL,
  eligibility_criteria JSONB NOT NULL, -- {income_level, age_min, age_max, gender, occupation, location_type, etc}
  benefits TEXT NOT NULL,
  benefit_amount TEXT, -- amount of financial benefit if applicable
  application_process TEXT NOT NULL,
  official_link TEXT NOT NULL,
  documents_required TEXT[],
  application_deadline DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user preferences table for scheme recommendations
CREATE TABLE public.user_scheme_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  income_level TEXT, -- low, middle, high
  occupation TEXT,
  education_level TEXT,
  location_type TEXT, -- rural, urban
  state TEXT,
  gender TEXT,
  age INTEGER,
  family_size INTEGER,
  interested_categories TEXT[], -- array of categories user is interested in
  notification_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scheme notifications table
CREATE TABLE public.scheme_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  scheme_id UUID NOT NULL REFERENCES public.schemes(id),
  notification_type TEXT NOT NULL, -- new_scheme, deadline_reminder, scheme_update
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_scheme_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheme_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for schemes (public read access)
CREATE POLICY "Anyone can view active schemes" 
ON public.schemes 
FOR SELECT 
USING (is_active = true);

-- RLS policies for user preferences
CREATE POLICY "Users can view their own preferences" 
ON public.user_scheme_preferences 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" 
ON public.user_scheme_preferences 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
ON public.user_scheme_preferences 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.scheme_notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.scheme_notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_schemes_category ON public.schemes(category);
CREATE INDEX idx_schemes_state ON public.schemes(state);
CREATE INDEX idx_schemes_active ON public.schemes(is_active);
CREATE INDEX idx_user_preferences_user_id ON public.user_scheme_preferences(user_id);
CREATE INDEX idx_notifications_user_id ON public.scheme_notifications(user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_schemes_updated_at
BEFORE UPDATE ON public.schemes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON public.user_scheme_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();