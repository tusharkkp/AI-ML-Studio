import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Quiz, QuizItem } from './Quiz';

describe('Quiz Component', () => {
  const mockItems: QuizItem[] = [
    {
      id: 'q1',
      question: 'What data structure does Breadth-First Search use for its frontier?',
      options: [
        {
          id: 'A',
          text: 'Stack (LIFO)',
          isCorrect: false,
          explanation: 'A stack produces Depth-First Search.',
        },
        {
          id: 'B',
          text: 'FIFO Queue',
          isCorrect: true,
          explanation: 'A FIFO queue ensures nodes are explored level-by-level.',
        },
        {
          id: 'C',
          text: 'Priority Queue with heuristic',
          isCorrect: false,
          explanation: 'That is Greedy Best-First or A*.',
        },
      ],
    },
  ];

  it('renders question and options', () => {
    render(<Quiz conceptId="test-bfs" items={mockItems} />);
    expect(
      screen.getByText(/What data structure does Breadth-First Search use/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/FIFO Queue/i)).toBeInTheDocument();
  });

  it('allows selecting an answer and submitting', () => {
    render(<Quiz conceptId="test-bfs" items={mockItems} />);

    const correctOption = screen.getByText(/FIFO Queue/i);
    fireEvent.click(correctOption);

    const submitBtn = screen.getByRole('button', { name: /check answers/i });
    expect(submitBtn).toBeEnabled();
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Perfect! You mastered this concept/i)).toBeInTheDocument();
    expect(
      screen.getByText(/A FIFO queue ensures nodes are explored level-by-level/i)
    ).toBeInTheDocument();
  });
});
