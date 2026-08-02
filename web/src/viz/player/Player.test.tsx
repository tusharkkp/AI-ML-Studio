import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Player } from './Player';
import { Step } from './types';

describe('Player Component', () => {
  const mockSteps: Step<{ count: number }>[] = [
    {
      index: 0,
      description: 'Initial state: starting algorithm.',
      highlights: ['node-A'],
      state: { count: 0 },
      metrics: { nodesExpanded: 0 },
      line: 1,
    },
    {
      index: 1,
      description: 'Expanding node A into frontier.',
      highlights: ['node-A', 'node-B'],
      state: { count: 1 },
      metrics: { nodesExpanded: 1 },
      line: 2,
    },
    {
      index: 2,
      description: 'Goal reached!',
      highlights: ['node-B'],
      state: { count: 2 },
      metrics: { nodesExpanded: 2 },
      line: 3,
    },
  ];

  it('renders initial step description and progress', () => {
    render(<Player steps={mockSteps} />);
    expect(screen.getByText('Initial state: starting algorithm.')).toBeInTheDocument();
    expect(screen.getByText('Step 1 / 3')).toBeInTheDocument();
  });

  it('advances step on clicking Step button', () => {
    const handleStepChange = vi.fn();
    render(<Player steps={mockSteps} onStepChange={handleStepChange} />);

    const stepBtn = screen.getByRole('button', { name: /step forward/i });
    fireEvent.click(stepBtn);

    expect(screen.getByText('Expanding node A into frontier.')).toBeInTheDocument();
    expect(screen.getByText('Step 2 / 3')).toBeInTheDocument();
    expect(handleStepChange).toHaveBeenCalledWith(mockSteps[1]);
  });

  it('steps backward on clicking Back button', () => {
    render(<Player steps={mockSteps} />);

    const stepBtn = screen.getByRole('button', { name: /step forward/i });
    fireEvent.click(stepBtn);
    expect(screen.getByText('Step 2 / 3')).toBeInTheDocument();

    const backBtn = screen.getByRole('button', { name: /step back/i });
    fireEvent.click(backBtn);
    expect(screen.getByText('Step 1 / 3')).toBeInTheDocument();
    expect(screen.getByText('Initial state: starting algorithm.')).toBeInTheDocument();
  });

  it('resets to start on clicking Reset button', () => {
    render(<Player steps={mockSteps} />);

    const stepBtn = screen.getByRole('button', { name: /step forward/i });
    fireEvent.click(stepBtn);
    fireEvent.click(stepBtn);
    expect(screen.getByText('Step 3 / 3')).toBeInTheDocument();

    const resetBtn = screen.getByRole('button', { name: /reset to start/i });
    fireEvent.click(resetBtn);
    expect(screen.getByText('Step 1 / 3')).toBeInTheDocument();
  });

  it('displays metrics in metrics strip', () => {
    render(<Player steps={mockSteps} />);
    expect(screen.getByText(/nodes expanded:/i)).toBeInTheDocument();
  });
});
