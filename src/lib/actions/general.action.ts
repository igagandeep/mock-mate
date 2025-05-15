'use server';

import { db } from '@/firebase/admin';
import { generateObject, generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { feedbackSchema } from '@/constants';
import { getRandomInterviewCover } from '../utils';
import { getCurrentUser } from './auth.action';

export async function createInterview(params: {
  role: string;
  level: string;
  amount: number;
  type: string;
  techstack: string[];
}) {
  const { role, level, amount, type, techstack } = params;
  const user = await getCurrentUser();

  try {
    const prompt = `
Prepare exactly ${amount} ${type} interview questions for the role "${role}" at ${level} level.
Return them as a JSON array like: ["Q1", "Q2", ..., "Q${amount}"]
Do not include explanations or markdown.
    `.trim();

    const { text: aiOutput } = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt,
    });

    const match = aiOutput.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('No JSON array in AI output');

    let questions = JSON.parse(match[0]);
    if (!Array.isArray(questions)) throw new Error('Invalid JSON format');

    questions = questions.slice(0, amount);

    const doc = await db.collection('interviews').add({
      role,
      level,
      type,
      amount,
      questions,
      userId: user?.id,
      techstack,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString().slice(0, 16),
    });

    return { success: true, id: doc.id };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('❌ Error creating interview:', err);
    return { success: false, error: err.message || 'Unknown error' };
  }
}
export async function getInterviewsByUserId(
  userId: string,
): Promise<Interview[] | null> {
  const interviews = await db
    .collection('interviews')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams,
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  const interviews = await db
    .collection('interviews')
    .orderBy('createdAt', 'desc')
    .where('userId', '!=', userId)
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection('interviews').doc(id).get();

  return interview.data() as Interview | null;
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`,
      )
      .join('');

    const {
      object: {
        totalScore,
        categoryScores,
        strengths,
        areasForImprovement,
        finalAssessment,
      },
    } = await generateObject({
      model: google('gemini-2.0-flash-001', {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        'You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories',
    });

    const feedback = await db.collection('feedback').add({
      interviewId,
      userId,
      totalScore,
      categoryScores,
      strengths,
      areasForImprovement,
      finalAssessment,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      feedbackId: feedback.id,
    };
  } catch (e) {
    console.error('Error saving feedback', e);

    return { success: false };
  }
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams,
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const feedback = await db
    .collection('feedback')
    .where('interviewId', '==', interviewId)
    .where('userId', '==', userId)
    .limit(1)
    .get();

  if (feedback.empty) return null;

  const feedbackDoc = feedback.docs[0];

  return {
    id: feedbackDoc.id,
    ...feedbackDoc.data(),
  } as Feedback;
}
