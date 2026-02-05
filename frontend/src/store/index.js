import { create } from 'zustand';

const useStore = create((set, get) => ({
  // Profile state
  profile: null,
  loading: false,
  error: null,
  
  // AI streaming state
  aiVerdict: '',
  aiVerdictStreaming: false,
  
  // Actions
  setProfile: (profile) => set({ profile }),
  
  fetchProfile: async (username) => {
    set({ loading: true, error: null, profile: null, aiVerdict: '' });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/github/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUsername: username })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const result = await response.json();
      const data = result.data || result;
      set({ profile: data, loading: false });
      
      // Start streaming AI verdict
      if (data) {
        get().streamAIVerdict(username, data);
      }
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
  
  streamAIVerdict: async (username, profileData) => {
    set({ aiVerdictStreaming: true, aiVerdict: '' });
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/github/ai-verdict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, profileData })
      });
      
      if (!response.ok) {
        throw new Error('Failed to stream AI verdict');
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              set({ aiVerdictStreaming: false });
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulatedText += parsed.content;
                set({ aiVerdict: accumulatedText });
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
      
      set({ aiVerdictStreaming: false });
    } catch (err) {
      console.error('Streaming error:', err);
      set({ aiVerdictStreaming: false });
    }
  },
  
  clearProfile: () => set({ 
    profile: null, 
    error: null, 
    aiVerdict: '',
    aiVerdictStreaming: false 
  }),
}));

export default useStore;

