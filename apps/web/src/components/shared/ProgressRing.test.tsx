import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressRing } from './ProgressRing';

describe('ProgressRing', () => {
  it('renders an SVG element', () => {
    const { container } = render(<ProgressRing percentage={50} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('renders with correct size', () => {
    const { container } = render(<ProgressRing percentage={50} size={200} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('200');
    expect(svg?.getAttribute('height')).toBe('200');
  });

  it('shows 0% as empty ring', () => {
    const { container } = render(<ProgressRing percentage={0} size={120} strokeWidth={8} />);
    const circles = container.querySelectorAll('circle');
    // There should be 2 circles: track and progress
    expect(circles.length).toBe(2);
    // Progress circle at 0% should have full offset (equal to circumference)
    const progressCircle = circles[1];
    const radius = (120 - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    expect(progressCircle.getAttribute('stroke-dasharray')).toBe(String(circumference));
    expect(progressCircle.getAttribute('stroke-dashoffset')).toBe(String(circumference));
  });

  it('shows 100% as full ring', () => {
    const { container } = render(<ProgressRing percentage={100} size={120} strokeWidth={8} />);
    const circles = container.querySelectorAll('circle');
    const progressCircle = circles[1];
    expect(progressCircle.getAttribute('stroke-dashoffset')).toBe('0');
  });

  it('shows 50% with correct stroke-dashoffset', () => {
    const { container } = render(<ProgressRing percentage={50} size={120} strokeWidth={8} />);
    const circles = container.querySelectorAll('circle');
    const progressCircle = circles[1];
    const radius = (120 - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const expectedOffset = circumference - (50 / 100) * circumference;
    expect(progressCircle.getAttribute('stroke-dashoffset')).toBe(String(expectedOffset));
  });

  it('renders label text when provided', () => {
    render(<ProgressRing percentage={75} label="75%" />);
    expect(screen.getByText('75%')).toBeTruthy();
  });

  it('renders children when provided', () => {
    render(
      <ProgressRing percentage={50}>
        <span data-testid="child">Hello</span>
      </ProgressRing>
    );
    expect(screen.getByTestId('child')).toBeTruthy();
  });
});
