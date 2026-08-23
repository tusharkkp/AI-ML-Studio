export interface ElizaRule {
  pattern: RegExp;
  responses: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'eliza';
  text: string;
  timestamp: string;
  matchedRulePattern?: string;
}

export interface ElizaResponse {
  reply: string;
  matchedPattern: string;
  transposedInput: string;
}

