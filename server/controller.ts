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

  preChoiceDone?: boolean;
  postChoiceDone?: boolean;
  videoDone?: boolean;
  preMatchingDone?: boolean;
  postMatchingDone?: boolean;
}

export async function createUser(name: string): Promise<string | undefined> {
  try {
    const { data } = await axios.post("/api/create", { name: name });
    return data.id;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllUsers(): Promise<Array<Object>> {
  let users = [];
  try {
    const { data } = await axios.get("/api/user/all");
    users = data;
  } catch (error) {
    console.log(error);
  } finally {
    return users;
  }
}

export async function getUser(id: string): Promise<Object> {
  let user: any;
  try {
    const { data } = await axios.get(`/api/user/${id}`);
    user = data;
  } catch (error) {
    console.log(error);
  } finally {
    return user;
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

export async function updateUser(id: string, record: UserRecord) {
  try {
    const res = await axios.patch(`/api/update/${id}`, record);
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
}
