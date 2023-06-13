// controller.ts
// Designed for frontend use

import axios from "axios";
import { MatchingCaseReply } from "@/store/matching";

interface UserRecord {
  preChoice?: number[];
  postChoice?: number[];
  video?: number[][];
  preMatching?: MatchingCaseReply[][];
  postMatching?: MatchingCaseReply[][];

  preChoiceSubmitted?: boolean;
  postChoiceSubmitted?: boolean;
  videoSubmitted?: boolean[];
  preMatchingSubmitted?: boolean;
  postMatchingSubmitted?: boolean;

  preChoiceScore?: number;
  postChoiceScore?: number;
  videoScore?: number;
  preMatchingScore?: number;
  postMatchingScore?: number;
}

export interface User extends UserRecord {
  id: string;
  name: string;
  internYear: string;
  order: string;
  feedbacks: string[];
}

export async function createUser(
  name: string,
  internYear: number,
  order: number
): Promise<string | null> {
  // Since localStorage.getItem return null when key does not exist,
  // thus we set default value to null here to make consistency.
  let id: string | null = null;
  try {
    const { data } = await axios.post("/api/create", {
      name: name,
      internYear: internYear,
      order: order,
    });
    id = data.id;
  } catch (error) {
    console.log(error);
  } finally {
    return id;
  }
}

export async function getAllUsers(): Promise<Array<User> | undefined> {
  try {
    const { data } = await axios.get("/api/users");
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getUser(id: string): Promise<User | undefined> {
  try {
    const { data } = await axios.get(`/api/user/${id}`);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(id: string, record: UserRecord) {
  try {
    await axios.patch(`/api/update/${id}`, record);
  } catch (error) {
    console.log(error);
  }
}

export async function updateUserFeedback(id: string, feedback: string) {
  try {
    const user: User | undefined = await getUser(id);
    let feedbacks: string[] | undefined = user?.feedbacks;
    feedbacks?.push(feedback);
    const { status } = await axios.patch(`/api/update/${id}`, {
      feedbacks: feedbacks,
    });
    return status === 200;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteUser(id: string) {
  try {
    const res = await axios.delete(`/api/delete/${id}`);
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
}

export async function deleteAllUsers() {
  try {
    const res = await axios.delete("/api/delete");
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
}
