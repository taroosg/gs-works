import "dotenv/load.ts";
import { createClient, PostgrestResponse } from "supabase";

/**
 * posts テーブルの型
 */
export interface Post {
  id: string;
  work_url: string;
  work_time: number;
  comment?: string;
  work: string;
  work_description?: string;
  student_number: string;
  student: string;
  rank: string;
  rank_id: string;
  class: string;
  created_at: string;
}

/**
 * workテーブルの型
 */
export interface Work {
  id: string;
  work_number: string;
  description: string;
  created_at: string;
}

/**
 * classesテーブルの型
 */
export type Class = {
  id: string;
  class_name: string;
  created_at: string;
  started_at: string;
  ended_at: string;
};

/**
 * studentsテーブルの型
 */
export type Student = {
  id: string;
  class_id: string;
  student_number: string;
  name: string;
  created_at: string;
  classes: Class;
};

/**
 * ランクの型
 */
export interface Rank {
  id: string;
  rank: string;
  created_at: string;
}

/**
 * 生データの型
 */

export interface rawData {
  id: string;
  student_id: string;
  work_id: string;
  work_url: string;
  work_time: number;
  rank_id?: string;
  comment?: string;
  created_at: string;
  works: Work;
  ranks: Rank;
  students: Student;
}

/**
 * 送信データの型
 */
export interface Data {
  students?:
    | Pick<Student, "id" | "classes" | "class_id" | "student_number" | "name">[]
    | null;
  works?:
    | Pick<Work, "id" | "work_number" | "description">[]
    | null;
  error?: {
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
 * 評価データの型
 */
export interface Update {
  post: Post | null;
  ranks: Rank[] | null;
  error?: {
    id: string;
    rank_id: string;
  };
  id?: string;
  rank_id?: string;
  comment?: string;
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON") ?? "",
  {},
);

const createFantasticData = (rawData: rawData[] | null): Post[] | [] => {
  const data = rawData?.map((x: rawData) => ({
    ...{
      id: x.id,
      work_url: x.work_url,
      work_time: x.work_time,
      comment: x.comment,
      created_at: x.created_at,
    },
    ...{
      work: x.works.work_number,
      work_description: x.works.description,
      student: x.students.name,
      student_number: x.students.student_number,
      class: x.students.classes.class_name,
      rank: x.ranks?.rank,
      rank_id: x.ranks?.id,
    },
  })).sort((a: Post, b: Post) => {
    if (a.class > b.class) return -1;
    if (a.class < b.class) return 1;
    if (a.work > b.work) return -1;
    if (a.work < b.work) return 1;
    if (a.student_number > b.student_number) return 1;
    if (a.student_number < b.student_number) return -1;
    return 0;
  });
  return data ?? [];
};

/**
 * すべての記事を取得する
 */
export const findAllPosts = async (): Promise<Post[] | []> => {
  try {
    const { data, error }: PostgrestResponse<rawData> = await supabase
      .from("posts")
      .select("*, works(*), ranks(*), students(*, classes(*))");
    // .order("class_name", {
    //   foreignTable: "students.classes",
    //   ascending: false,
    // })
    // .order("work_id", { ascending: false })
    // .order("name", {
    //   foreignTable: "students",
    //   ascending: true,
    // });
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
    const { data, error }: PostgrestResponse<rawData> = await supabase
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
export const getClasses = async (): Promise<Class[] | null> => {
  try {
    const { data, error }: PostgrestResponse<Class> = await supabase
      .from("classes")
      .select("id, class_name, started_at, ended_at, created_at")
      .lte("started_at", new Date().toLocaleDateString())
      .gte("ended_at", new Date().toLocaleDateString())
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
export const getStudents = async (): Promise<Student[] | null> => {
  try {
    const classes: Pick<
      Class,
      "id" | "class_name" | "started_at" | "ended_at"
    >[] | null = await getClasses();
    const classIds = classes === null ? [] : classes.map((x) => x.id);
    const { data, error }: PostgrestResponse<Student> = await supabase
      .from("students")
      .select(
        "*, classes(*)",
      )
      .in("class_id", classIds)
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
export const getWorks = async (): Promise<Work[] | null> => {
  try {
    const { data, error }: PostgrestResponse<Work> = await supabase
      .from("works")
      .select("id, work_number, description, created_at")
      .order("work_number", { ascending: true });
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

/**
 * すごい課題一覧を取得する
 */
export const findFantasticPosts = async (): Promise<Post[] | []> => {
  try {
    const { data, error }: PostgrestResponse<rawData> = await supabase
      .from("posts")
      .select("*, works(*), ranks(*), students(*, classes(*))")
      .match({ rank_id: 1 });
    return createFantasticData(data);
  } catch (e) {
    console.error(e);
    return [];
  }
};

// 既存データ有無のチェック
const isExistsSameWork = async (
  post: Pick<Data, "work_id" | "student_id" | "work_url" | "work_time">,
): Promise<boolean | null> => {
  try {
    const { work_id, student_id } = post;
    const { data, error }: PostgrestResponse<Post> = await supabase
      .from("posts")
      .select()
      .match({ work_id, student_id });
    return data?.length !== 0;
  } catch (e) {
    console.error(e);
    return null;
  }
};

/**
 * 記事を新規作成する
 */
export const createPost = async (
  post: Pick<Data, "work_id" | "student_id" | "work_url" | "work_time">,
): Promise<undefined[] | null> => {
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
    const { data, error }: PostgrestResponse<Rank> = await supabase
      .from("ranks")
      .select("id, rank, created_at")
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
): Promise<undefined[] | null> => {
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
