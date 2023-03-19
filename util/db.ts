import "dotenv/load.ts";
import { createClient, PostgrestResponse } from "supabase";

/**
 * posts テーブルの型
 */
export interface Post {
  id: string;
  student_id: string;
  work_id: string;
  work_url: string;
  rank_id: string;
  comment?: string;
  work_time: number;
  created_at: string;
}

/**
 * ほしい形にしたPostデータの型
 */
export interface PostOptimized {
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
 * 画面表示用のデータの型
 */
export interface Show {
  posts?: PostOptimized[] | null;
  works: Work[] | null;
  classes: Class[] | null;
  work_id?: string | null;
  class_id?: string | null;
  is_post?: boolean;
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
 * Post他，生データの型
 */
export type PostRaw = Post & {
  works: Work;
  ranks: Rank;
  students: Student;
};

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
  post: PostOptimized | null;
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

const createFantasticData = (
  rawData: PostRaw[] | null,
): PostOptimized[] | [] => {
  const data = rawData?.map((x: PostRaw) => ({
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
  })).sort((a: PostOptimized, b: PostOptimized) => {
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
export const findAllPosts = async (): Promise<PostOptimized[] | []> => {
  try {
    const { data }: PostgrestResponse<PostRaw> = await supabase
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
 * 最近の記事20件を取得する
 */
export const findRecentPosts = async (): Promise<PostOptimized[] | []> => {
  try {
    const { data }: PostgrestResponse<PostRaw> = await supabase
      .from("posts")
      .select("*, works(*), ranks(*), students(*, classes(*))")
      .order("created_at", { ascending: false })
      .limit(20);
    return createFantasticData(data);
  } catch (e) {
    console.error(e);
    return [];
  }
};

/**
 * ID を指定して記事を取得する
 */
export const findPostById = async (
  id: string,
): Promise<PostOptimized | null> => {
  try {
    const { data }: PostgrestResponse<PostRaw> = await supabase
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
 * クラスと課題 を指定して記事を取得する
 */
export const findPostsByClassAndWork = async (
  class_id?: string,
  work_id?: string,
): Promise<PostOptimized[] | []> => {
  try {
    const students = class_id
      ? (await supabase
        .from("students")
        .select("id")
        .match({ class_id: class_id })).data?.map((x) => x.id)
      : [];
    const query = supabase
      .from("posts")
      .select("*,works(*),ranks(*),students(*,classes(*))");

    const filteredByClass = class_id
      ? query.in("student_id", students ?? [])
      : query;

    const filteredByWork = work_id
      ? filteredByClass.eq("work_id", work_id)
      : query;

    const { data } = await filteredByWork;

    return createFantasticData(data);
  } catch (e) {
    console.error(e);
    return [];
  }
};

/**
 * クラス一覧を取得する
 */
export const getClasses = async (): Promise<Class[] | null> => {
  try {
    const { data }: PostgrestResponse<Class> = await supabase
      .from("classes")
      .select("id, class_name, started_at, ended_at, created_at")
      .order("started_at", { ascending: false });
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

/**
 * 開講中のクラス一覧を取得する
 */
export const getNowClasses = async (): Promise<Class[] | null> => {
  try {
    const { data }: PostgrestResponse<Class> = await supabase
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
    >[] | null = await getNowClasses();
    const classIds = classes === null ? [] : classes.map((x) => x.id);
    const { data }: PostgrestResponse<Student> = await supabase
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
    const { data }: PostgrestResponse<Work> = await supabase
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
 * クラスと課題 を指定してすごい課題一覧を取得する
 */
export const findFantasticPosts = async (
  class_id?: string,
  work_id?: string,
): Promise<PostOptimized[]> => {
  try {
    const students = class_id
      ? (await supabase
        .from("students")
        .select("id")
        .match({ class_id: class_id })).data?.map((x) => x.id)
      : [];
    const query = supabase
      .from("posts")
      .select("*,works(*),ranks(*),students(*,classes(*))");

    const filteredByClass = class_id
      ? query.in("student_id", students ?? [])
      : query;

    const filteredByWork = work_id
      ? filteredByClass.eq("work_id", work_id)
      : query;

    const { data } = await filteredByWork.match({ rank_id: 1 });

    // const { data }: PostgrestResponse<PostRaw> = await supabase
    //   .from("posts")
    //   .select("*, works(*), ranks(*), students(*, classes(*))")
    //   .match({ rank_id: 1 });
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
    const { data }: PostgrestResponse<Post> = await supabase
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
      const { data } = await supabase
        .from("posts")
        .update({ work_url, work_time })
        .match({ work_id, student_id });
      return data;
    } else {
      const { data } = await supabase
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
    const { data }: PostgrestResponse<Rank> = await supabase
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
    const { data } = await supabase
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
