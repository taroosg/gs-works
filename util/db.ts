import "dotenv/load.ts";
import { createClient } from "supabase";

/**
 * posts テーブルの型
 */
export interface Post {
  id: string;
  work_url: string;
  work_time: number;
  comment: string;
  work: string;
  student_number: string;
  student: string;
  rank: string;
  rank_id: string;
  class: string;
  created_at: string;
}

/**
 * 送信データの型
 */
export interface Data {
  error: {
    work_id: string;
    student_id: string;
    work_url: string;
    work_time: string;
  };
  work_id?: string;
  student_id?: string;
  work_url?: string;
  work_time?: string;
}

/**
 * ランクの型
 */
export interface Rank {
  id: string;
  rank: string;
}

/**
 * 評価データの型
 */
export interface Update {
  error: {
    id: string;
    rank_id: string;
  };
  id?: string;
  rank_id?: string;
  comment?: string;
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_ANON"),
  {},
);

const createFantasticData = (rawData): Post[] =>
  rawData.map((x) => ({
    ...x,
    ...{
      work: x.works.work_number,
      student: x.students.name,
      student_number: x.students.student_number,
      class: x.students.classes.class_name,
      rank: x.ranks?.rank,
      rank_id: x.ranks?.id,
    },
  }));

/**
 * すべての記事を取得する
 */
export const findAllPosts = async (): Promise<Post[] | []> => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*,works(*),ranks(*),students(*,classes(*))")
      .order("class_name", {
        foreignTable: "students.classes",
        ascending: false,
      })
      .order("work_id", { ascending: false })
      .order("student_number", {
        foreignTable: "students",
        ascending: true,
      });
    return createFantasticData(data);
  } catch (e) {
    console.error(e);
    return [];
  }
};

/**
 * ID を指定して記事を取得する
 */
export const findPostById = async (id: string): Promise<Post | null> => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*,works(*),ranks(*),students(*,classes(*))")
      .match({ id: [id] });
    return createFantasticData(data)[0];
  } catch (e) {
    console.error(e);
    return null;
  }
};

/**
 * クラス一覧を取得する
 */
export const getClasses = async () => {
  try {
    const { data, error } = await supabase
      .from("classes")
      .select("id, class_name")
      .order("started_at", { ascending: false });
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

/**
 * 受講生一覧を取得する
 */
export const getStudents = async () => {
  try {
    const { data, error } = await supabase
      .from("students")
      .select("id, classes(*), student_number, name")
      .order("student_number", { ascending: true });
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

/**
 * 課題一覧を取得する
 */
export const getWorks = async () => {
  try {
    const { data, error } = await supabase
      .from("works")
      .select("id, work_number, description")
      .order("work_number", { ascending: true });
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

// 既存データ有無のチェック
const isExistsSameWork = async (
  post: Pick<Data, "work_id" | "student_id" | "work_url" | "work_time">,
): Promise<boolean | null> => {
  try {
    const { work_id, student_id } = post;
    const { data, error } = await supabase
      .from("posts")
      .select()
      .match({ work_id, student_id });
    console.log(data);
    return data.length !== 0;
  } catch (e) {
    console.error(e);
    return null;
  }
};

// 課題上書きの処理

/**
 * 記事を新規作成する
 */
export const createPost = async (
  post: Pick<Data, "work_id" | "student_id" | "work_url" | "work_time">,
): Promise<Post[] | null> => {
  try {
    const { work_id, student_id, work_url, work_time } = post;
    if (await isExistsSameWork(post)) {
      const { data, error } = await supabase
        .from("posts")
        .update({ work_url, work_time })
        .match({ work_id, student_id });
      return data;
    } else {
      const { data, error } = await supabase
        .from("posts")
        .insert(post);
      return data;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};

/**
 * ランク一覧を取得する
 */
export const getRanks = async (): Promise<Rank[] | null> => {
  try {
    const { data, error } = await supabase
      .from("ranks")
      .select("id, rank")
      .order("id", { ascending: true });
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

/**
 * 課題を評価する
 */
export const updatePost = async (
  update: Pick<Update, "id" | "rank_id" | "comment">,
): Promise<Post[] | null> => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .update({
        rank_id: update.rank_id === "" ? null : update.rank_id,
        comment: update.comment === "" ? null : update.comment,
      })
      .match({ id: Number(update.id) });
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
};
