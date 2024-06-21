declare module "node-nlp" {
    interface Explanation {
        token: string;
        stem: string;
        weight: number;
    }

    interface Classification {
        intent: string;
        score: number;
    }

    interface Answer {
        answer: string;
    }

    interface Sentiment {
        score: number;
        numWords: number;
        numHits: number;
        average: number;
        type: string;
        locale: string;
        vote: string;
    }

    interface NluAnswer {
        classifications: Classification[];
    }

    interface NlpResult {
        locale: string;
        utterance: string;
        languageGuessed: boolean;
        localeIso2: string;
        language: string;
        explanation: Explanation[];
        classifications: Classification[];
        intent: string;
        score: number;
        domain: string;
        entities: any[];
        sourceEntities: any[];
        answers: Answer[];
        answer: string;
        actions: any[];
        sentiment: Sentiment;
        nluAnswer?: NluAnswer;
    }

    interface NlpManagerOptions {
        languages: string[];
    }

    class NlpManager {
        constructor(options?: NlpManagerOptions);
        
        addDocument(locale: string, utterance: string, intent: string): void;
        addAnswer(locale: string, intent: string, answer: string): void;
        process(locale: string, utterance: string): Promise<NlpResult>;
        train(): Promise<void>;
    }
}