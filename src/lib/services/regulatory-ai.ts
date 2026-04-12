/**
 * Regulatory Intelligence AI Service
 * Integrates with Ascent AI service for circular extraction
 */

const AI_SERVICE_BASE_URL = 'https://ai-service.ascentbusiness.com';

export interface ActionItem {
  title: string;
  description: string;
  deadline: string;
  referenceSection: string;
  criticality: 'Critical' | 'High' | 'Medium' | 'Low';
  confidenceScore: number;
}

export interface CircularExtractionResponse {
  success: boolean;
  circularTitle?: string;
  publishDate?: string;
  source?: string;
  actionItems: ActionItem[];
  metadata?: {
    totalPages?: number;
    processingTime?: number;
    circularNumber?: string;
    averageConfidence?: string;
    actionsExtracted?: number;
  };
  error?: string;
}

/**
 * Extract action items from a regulatory circular PDF
 */
export async function extractCircularActionItems(
  file: File
): Promise<CircularExtractionResponse> {
  try {
    const formData = new FormData();

    // Create a new Blob with explicit PDF type
    const pdfBlob = new Blob([file], { type: 'application/pdf' });

    // Append with explicit filename and type
    formData.append('file', pdfBlob, file.name.endsWith('.pdf') ? file.name : `${file.name}.pdf`);

    // eslint-disable-next-line no-console
    console.log('📤 Uploading to AI service:', {
      filename: file.name,
      size: file.size,
      originalType: file.type,
      blobType: pdfBlob.type,
      url: `${AI_SERVICE_BASE_URL}/grc/api/v1/regulatory-intelligence/circular-extractor/extract`
    });

    const response = await fetch(
      `${AI_SERVICE_BASE_URL}/grc/api/v1/regulatory-intelligence/circular-extractor/extract`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      }
    );

    // eslint-disable-next-line no-console
    console.log('📥 Response status:', response.status, response.statusText);

    // Try to get response body for debugging
    const responseText = await response.text();
    // eslint-disable-next-line no-console
    console.log('📥 Response body:', responseText);

    if (!response.ok) {
      // Try to parse error message
      let errorMessage = response.statusText;
      try {
        const errorData = JSON.parse(responseText);
        // Check for common error field names
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // Response is not JSON, use text
        if (responseText && responseText.length < 200) {
          errorMessage = responseText;
        }
      }
      throw new Error(errorMessage);
    }

    // Parse successful response
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error('Invalid response format from AI service');
    }

    // eslint-disable-next-line no-console
    console.log('✅ Extraction successful:', data);

    // Map API response to our interface
    const actionItems: ActionItem[] = (data.action_items || []).map((item: any) => ({
      title: item.title || '',
      description: item.title_description || item.description || '',
      deadline: item.deadline || 'No deadline specified',
      referenceSection: item.reference_section || '',
      criticality: item.criticality as 'Critical' | 'High' | 'Medium' | 'Low',
      confidenceScore: typeof item.confidence_score === 'string'
        ? parseInt(item.confidence_score.replace('%', ''))
        : item.confidence_score || 0,
    }));

    return {
      success: true,
      actionItems,
      circularTitle: data.circular_info?.title || data.circularTitle,
      publishDate: data.circular_info?.issue_date || data.publishDate,
      source: data.circular_info?.category || data.source,
      metadata: {
        totalPages: data.circular_info?.total_pages,
        processingTime: data.processing_time,
        circularNumber: data.circular_info?.circular_number,
        averageConfidence: data.average_confidence,
        actionsExtracted: data.actions_extracted,
      },
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('❌ Circular extraction failed:', error);
    return {
      success: false,
      actionItems: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Validate PDF file before upload
 */
export function validateCircularPDF(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (file.type !== 'application/pdf') {
    return { valid: false, error: 'Only PDF files are supported' };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  // Check if file has content
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }

  return { valid: true };
}
