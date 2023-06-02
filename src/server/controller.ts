// controller.ts
// Designed for frontend use

import axios from "axios";
import { MatchingCaseReply } from "@/store/matching";

interface UserRecord {
  preChoice?: number[];
  postChoice?: number[];
  video?: number[];
  preMatching?: MatchingCaseReply[][];
  postMatching?: MatchingCaseReply[][];

  preChoiceSubmitted?: boolean;
  postChoiceSubmitted?: boolean;
  videoSubmitted?: boolean;
  preMatchingSubmitted?: boolean;
  postMatchingSubmitted?: boolean;
}

interface User extends UserRecord {
  name: string;
  id: string;
}

export async function createUser(name: string): Promise<string | null> {
  // Since localStorage.getItem return null when key does not exist, thus we set default value to null here to make consistency.
  let id: string | null = null;
  try {
    const { data } = await axios.post("/api/create", { name: name });
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
