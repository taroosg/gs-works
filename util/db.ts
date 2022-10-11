import { Client } from "postgress";
import "dotenv/load.ts";
import { createClient } from "supabase";

/**
 * articls テーブルの型
 */
export interface Post {
  id: string;
  class_name: string;
  class_number: string;
  work_number: string;
  work_url: string;
  rank: string;
  created_at: string;
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_ANON"),
);

/**
 * すべての記事を取得する
 */
export const findAllPosts = async () => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        id,
        student:student_id ( name ),
        work_url
      `);
    console.log(data);
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

/**
 * ID を指定して記事を取得する
 */
export const findPostById = async (id: string) => {
  try {
    const result = await client.queryObject<Post>(
      "SELECT * FROM posts WHERE id = $1",
      [id],
    );
    if (result.rowCount === 0) {
      return null;
    }
    return result.rows[0];
  } catch (e) {
    console.error(e);
    return null;
  }
};

/**
 * 記事を新規作成する
 */
export const createPost = async (post: Pick<Post, "title" | "content">) => {
  try {
    const result = await client.queryObject<Post>(
      "INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *",
      [post.title, post.content],
    );
    return result.rows[0];
  } catch (e) {
    console.error(e);
    return null;
  }
};
