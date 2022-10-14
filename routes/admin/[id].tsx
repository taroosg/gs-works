import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/src/runtime/head.ts";
import { Handlers } from "$fresh/server.ts";
import { Post, Update, Rank, findPostById, getRanks, updatePost } from "@db";
import dayjs from "https://esm.sh/dayjs@1.11.3";

interface Hoge {
  post: unknown;
  ranks: unknown;
}

export const handler: Handlers<Hoge | Update | null> = {
  async GET(req, ctx) {

    const { id } = ctx.params;

    const post = await findPostById(id);
    const ranks = await getRanks();

    if (!post || !ranks) {
      return ctx.render(null);
    }

    return ctx.render({ post, ranks });
  },
  async POST(req, ctx) {
    const { id } = ctx.params;

    const formData = await req.formData();
    const rank_id = formData.get("rank")?.toString();
    const comment = formData.get("comment")?.toString();
    if (!id || !rank_id) {
      const post = await findPostById(id);
      const ranks = await getRanks();

      return ctx.render({
        post, ranks,
        error: {
          id: id ? "" : "id is required",
          rank_id: rank_id ? "" : "rank is required",
        },
        id,
        rank_id,
        comment,
      });
    }

    const update = {
      id,
      rank_id,
      comment,
    };

    await updatePost(update);

    return new Response("", {
      status: 303,
      headers: {
        Location: `/`,
      },
    });
  },
};


export default function PostPage({ data }: PageProps<Hoge | null>) {

  if (!data) {
    return <div>Not Found</div>;
  }
  return (
    <div class="min-h-screen bg-gray-200">
      <Head>
        <title>{data.post.student}</title>
      </Head>
      <div
        class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col"      >
        <article class="rounded-xl border p-5 shadow-md bg-white">
          <header>
            <h1 class="font-extrabold text-5xl text-gray-800">
              Work Detail
            </h1>
            <time class="text-gray-500 text-sm" dateTime={data.post.created_at}>
              {dayjs(data.post.created_at).format("YYYY-MM-DD HH:mm:ss")}
            </time>
          </header>
          <section class="mt-6">
            <p>{data.post.class}</p>
            <p>{data.post.student_number}</p>
            <p>{data.post.student}</p>
            <p>{data.post.work_time}</p>
            <p>{data.post.work_url}</p>
            <p>{data.post.rank}</p>
            <p>{data.post.comment}</p>
          </section>
        </article>
        <form
          class="rounded-xl border p-5 shadow-md bg-white mt-8" method="POST"
        >
          <div class="flex flex-col gap-y-2">
            <div>
              <label class="text-gray-500 text-sm" htmlFor="title">
                Rank
              </label>
              <select
                class="w-full p-2 border border-gray-300 rounded-md"
                name="rank" id="rank"
                defaultValue={data.post.rank_id}
              >
                <option value="">-</option>
                {data.ranks.map((x) =>
                  <option value={x.id}>{x.rank}</option>
                )}
              </select>
              {data?.error?.rank_id && (
                <p class="text-red-500 text-sm">{data.error.rank_id}</p>
              )}
            </div>
            <div>
              <label class="text-gray-500 text-sm" htmlFor="content">
                Comment
              </label>
              <textarea
                id="comment"
                rows={5}
                class="w-full p-2 border border-gray-300 rounded-md"
                name="comment"
                placeholder="推薦の場合はコメントを入力してください．"
              />
            </div>
          </div>
          <div class="flex justify-end mt-4">
            <a href="/">
              <button
                class="bg-white text-blue-500 font-bold py-2 px-4 mx-4 rounded-md border border-blue-500"
                type="button"
              >
                Back
              </button>
            </a>
            <button
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}