import { render, screen } from '@testing-library/react';
import { ProjectCard } from './ProjectCard';

const mockProject = {
  id: '1',
  slug: 'test-project',
  title: 'Test Project',
  description: 'This is a test project',
  type: 'crowdfunding',
  fundingGoal: 10000,
  amountRaised: 5000,
  backersCount: 25,
  status: 'active',
  category: 'technology',
  imageUrl: 'https://example.com/image.jpg',
  deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('ProjectCard', () => {
  it('renders project title', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('renders project description', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('This is a test project')).toBeInTheDocument();
  });

  it('displays funding progress', () => {
    render(<ProjectCard project={mockProject} />);
    // Should show 50% progress (5000 / 10000)
    expect(screen.getByText(/50%/i)).toBeInTheDocument();
  });

  it('displays backers count', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText(/25/i)).toBeInTheDocument();
  });

  it('displays amount raised', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText(/5,000/i)).toBeInTheDocument();
  });

  it('displays funding goal', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText(/10,000/i)).toBeInTheDocument();
  });

  it('renders project image when provided', () => {
    render(<ProjectCard project={mockProject} />);
    const image = screen.getByAltText('Test Project');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('handles missing image gracefully', () => {
    const projectWithoutImage = { ...mockProject, imageUrl: null };
    render(<ProjectCard project={projectWithoutImage} />);
    // Should still render the card
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('displays category', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText(/technology/i)).toBeInTheDocument();
  });

  it('calculates progress percentage correctly', () => {
    const project = { ...mockProject, amountRaised: 7500, fundingGoal: 10000 };
    render(<ProjectCard project={project} />);
    expect(screen.getByText(/75%/i)).toBeInTheDocument();
  });

  it('handles zero progress', () => {
    const project = { ...mockProject, amountRaised: 0 };
    render(<ProjectCard project={project} />);
    expect(screen.getByText(/0%/i)).toBeInTheDocument();
  });

  it('handles 100% progress', () => {
    const project = { ...mockProject, amountRaised: 10000 };
    render(<ProjectCard project={project} />);
    expect(screen.getByText(/100%/i)).toBeInTheDocument();
  });
});

