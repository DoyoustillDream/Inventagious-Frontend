import { fetchProjects, fetchProject, createProject, contributeToProject } from './projects';

// Mock fetch globally
global.fetch = jest.fn();

describe('Projects API', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('fetchProjects', () => {
    it('fetches projects successfully', async () => {
      const mockProjects = [
        {
          id: '1',
          title: 'Test Project',
          status: 'active',
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProjects,
      });

      const result = await fetchProjects();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/projects'),
        expect.any(Object),
      );
      expect(result).toEqual(mockProjects);
    });

    it('handles fetch errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchProjects()).rejects.toThrow('Network error');
    });

    it('handles non-ok responses', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(fetchProjects()).rejects.toThrow();
    });

    it('passes query parameters correctly', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await fetchProjects({ type: 'crowdfunding', status: 'active' });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('type=crowdfunding'),
        expect.any(Object),
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('status=active'),
        expect.any(Object),
      );
    });
  });

  describe('fetchProject', () => {
    it('fetches single project by ID', async () => {
      const mockProject = {
        id: '1',
        title: 'Test Project',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProject,
      });

      const result = await fetchProject('1');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/projects/1'),
        expect.any(Object),
      );
      expect(result).toEqual(mockProject);
    });

    it('fetches project by slug', async () => {
      const mockProject = {
        id: '1',
        slug: 'test-project',
        title: 'Test Project',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProject,
      });

      const result = await fetchProject('test-project');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/projects/test-project'),
        expect.any(Object),
      );
      expect(result).toEqual(mockProject);
    });

    it('handles 404 errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(fetchProject('nonexistent')).rejects.toThrow();
    });
  });

  describe('createProject', () => {
    it('creates project successfully', async () => {
      const projectData = {
        title: 'New Project',
        description: 'Project Description',
        type: 'crowdfunding',
        fundingGoal: 10000,
        category: 'technology',
      };

      const mockResponse = {
        id: 'new-id',
        ...projectData,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const token = 'test-token';
      const result = await createProject(projectData, token);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/projects'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(projectData),
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it('handles validation errors', async () => {
      const projectData = {
        title: '', // Invalid: empty title
        description: 'Project Description',
        type: 'crowdfunding',
        fundingGoal: 10000,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Validation failed' }),
      });

      await expect(createProject(projectData, 'token')).rejects.toThrow();
    });
  });

  describe('contributeToProject', () => {
    it('contributes to project successfully', async () => {
      const contributionData = {
        amount: 100,
        contributorWalletAddress: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
        transactionSignature: 'tx-signature',
      };

      const mockResponse = {
        success: true,
        feeBreakdown: {
          grossAmount: 100,
          platformFee: 1.9,
          netAmount: 98.1,
        },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const token = 'test-token';
      const result = await contributeToProject('project-id', contributionData, token);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/projects/project-id/contribute'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(contributionData),
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it('handles insufficient funds error', async () => {
      const contributionData = {
        amount: 100,
        contributorWalletAddress: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Insufficient funds' }),
      });

      await expect(contributeToProject('project-id', contributionData, 'token')).rejects.toThrow();
    });
  });
});

