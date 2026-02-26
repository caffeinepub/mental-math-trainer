import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Problem {
    question: string;
    correctAnswer: bigint;
    operation: Operation;
}
export type Time = bigint;
export interface Score {
    name: string;
    numCorrect: bigint;
    timestamp: Time;
}
export enum Operation {
    subtraction = "subtraction",
    division = "division",
    addition = "addition",
    multiplication = "multiplication"
}
export interface backendInterface {
    generateProblem(): Promise<Problem>;
    getLeaderboard(): Promise<Array<Score>>;
    submitScore(name: string, numCorrect: bigint): Promise<void>;
}
