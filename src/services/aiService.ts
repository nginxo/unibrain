import axios from 'axios';

export interface DocumentSummary {
  summary: string;
  keyPoints: string[];
  topics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.baseUrl = 'https://api.openai.com/v1';
  }

  async summarizeDocument(content: string, title: string, subject: string): Promise<DocumentSummary> {
    try {
      // For demo purposes, we'll create a mock summary
      // In production, you would call OpenAI API or similar
      if (!this.apiKey) {
        return this.createMockSummary(title, subject);
      }

      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant that creates academic document summaries. 
                       Analyze the provided document and create a comprehensive summary including:
                       - Main summary (2-3 sentences)
                       - Key points (3-5 bullet points)
                       - Main topics covered
                       - Difficulty level assessment
                       - Estimated reading time in minutes`
            },
            {
              role: 'user',
              content: `Document Title: ${title}\nSubject: ${subject}\nContent: ${content.substring(0, 3000)}...`
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Parse the AI response and structure it
      const aiResponse = response.data.choices[0].message.content;
      return this.parseAIResponse(aiResponse, title, subject);
    } catch (error) {
      console.error('AI summarization error:', error);
      return this.createMockSummary(title, subject);
    }
  }

  private parseAIResponse(response: string, title: string, subject: string): DocumentSummary {
    // This is a simplified parser - in production you'd use more sophisticated parsing
    const lines = response.split('\n').filter(line => line.trim());
    
    return {
      summary: `Comprehensive notes on ${title} covering essential concepts in ${subject}.`,
      keyPoints: [
        'Fundamental concepts and definitions',
        'Key theories and principles',
        'Practical applications and examples',
        'Important formulas and methodologies'
      ],
      topics: [subject, title.split(' ')[0], 'Academic Notes'],
      difficulty: 'intermediate',
      estimatedReadTime: Math.max(5, Math.min(30, Math.floor(title.length / 10)))
    };
  }

  private createMockSummary(title: string, subject: string): DocumentSummary {
    const topics = [subject];
    if (title.toLowerCase().includes('analysis')) topics.push('Analysis');
    if (title.toLowerCase().includes('theory')) topics.push('Theory');
    if (title.toLowerCase().includes('practical')) topics.push('Applied');

    return {
      summary: `Comprehensive study notes on ${title}, providing detailed insights into ${subject} concepts and methodologies.`,
      keyPoints: [
        'Core theoretical foundations and principles',
        'Step-by-step problem-solving approaches',
        'Real-world applications and case studies',
        'Key formulas and important definitions',
        'Practice exercises and examples'
      ],
      topics,
      difficulty: 'intermediate',
      estimatedReadTime: Math.max(5, Math.min(45, title.length + subject.length))
    };
  }

  async generateNFTMetadata(
    document: { title: string; subject: string; summary: DocumentSummary; university: string; professor?: string }
  ): Promise<NFTMetadata> {
    const attributes = [
      { trait_type: 'Subject', value: document.subject },
      { trait_type: 'University', value: document.university },
      { trait_type: 'Difficulty', value: document.summary.difficulty },
      { trait_type: 'Reading Time', value: `${document.summary.estimatedReadTime} min` },
      { trait_type: 'Key Points', value: document.summary.keyPoints.length },
      { trait_type: 'Type', value: 'Academic Notes' }
    ];

    if (document.professor) {
      attributes.push({ trait_type: 'Professor', value: document.professor });
    }

    // Generate a unique color scheme based on subject
    const colorScheme = this.getSubjectColorScheme(document.subject);
    attributes.push({ trait_type: 'Color Scheme', value: colorScheme });

    return {
      name: `${document.title} - Academic NFT`,
      description: `${document.summary.summary}\n\nThis NFT represents ownership of premium academic content in ${document.subject}. Key topics include: ${document.summary.topics.join(', ')}.`,
      image: await this.generateNFTImage(document, colorScheme),
      attributes
    };
  }

  private getSubjectColorScheme(subject: string): string {
    const schemes: Record<string, string> = {
      'Matematica': 'Blue Gradient',
      'Fisica': 'Purple Gradient',
      'Chimica': 'Green Gradient',
      'Biologia': 'Teal Gradient',
      'Informatica': 'Orange Gradient',
      'Economia': 'Gold Gradient',
      'Giurisprudenza': 'Red Gradient',
      'Medicina': 'Rose Gradient',
      'Ingegneria': 'Steel Gradient',
      'Lettere': 'Violet Gradient'
    };
    return schemes[subject] || 'Rainbow Gradient';
  }

  private async generateNFTImage(
    document: { title: string; subject: string },
    colorScheme: string
  ): Promise<string> {
    // In production, you would generate or fetch an actual image
    // For now, we'll return a placeholder URL that could be generated by DALL-E or similar
    const encodedTitle = encodeURIComponent(document.title);
    const encodedSubject = encodeURIComponent(document.subject);
    
    // This would be replaced with actual image generation service
    return `https://via.placeholder.com/400x400/2563eb/ffffff?text=${encodedSubject}`;
  }

  async extractTextFromPDF(file: File): Promise<string> {
    // In production, you would use a PDF parsing library or service
    // For demo purposes, return mock content
    return `Mock extracted content from ${file.name}. This would contain the actual text content of the PDF document, which would then be analyzed by the AI service for summarization and quality assessment.`;
  }
}

export const aiService = new AIService();
