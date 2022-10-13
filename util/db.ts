import "dotenv/load.ts";
import { CHAR_RIGHT_ANGLE_BRACKET } from "https://deno.land/std@0.150.0/path/_constants.ts";
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
  class: string;
  created_at: string;
}

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

const supabase = createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_ANON"),
);

const createFantasticData = (rawData): Post[] =>
  rawData.map((x) => ({
    ...x,
    ...{
      work: x.work.work_number,
      student: x.student.name,
      student_number: x.student.student_number,
      class: x.student.class.class_name,
      rank: x.rank?.rank,
    },
  }));

/**
 * すべての記事を取得する
 */
export const findAllPosts = async (): Promise<Post[] | []> => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        id,
        work:work_id ( work_number ),
        student:student_id ( name, student_number, class:class_id ( class_name ) ),
        rank:rank_id ( rank ),
        work_url,
        work_time,
        comment,
        created_at
      `);
    console.log(createFantasticData(data));
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
      .select(`
        id,
        work:work_id ( work_number ),
        student:student_id ( name, student_number, class:class_id ( class_name ) ),
        rank:rank_id ( rank ),
        work_url,
        work_time,
        comment,
        created_at
      `)
      .eq("id", [id]);
    console.log(createFantasticData(data));
    return createFantasticData(data)[0];
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
) => {
  try {
    console.log(post);
    const { data, error } = await supabase
      .from("posts")
      .insert(post);
    // const result = await client.queryObject<Post>(
    //   "INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *",
    //   [post.title, post.content],
    // );
    console.log(data);
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
};
