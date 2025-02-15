export type SubscriptionTier = 'freemium' | 'basic' | 'professional' | 'advanced' | 'enterprise';
export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'past_due';

export interface PlanLimits {
  epics: number;
  userStories: number;
  tasks: number;
  acceptanceCriteria: boolean;
  testScripts: boolean;
}

export interface PlanPricing {
  monthly: number;
  tokens: number;
  currency: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  status: SubscriptionStatus;
  subscription_id: string;
  current_period_end: string;
  tier: SubscriptionTier;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  tokens: number;
  features: string[];
  limits: PlanLimits;
} 