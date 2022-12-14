import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/src/runtime/head.ts";
import { Handlers } from "$fresh/server.ts";
import { Post, Update, Rank, findPostById, getRanks, updatePost, PostOptimized } from "@db";
import dayjs from "https://esm.sh/dayjs@1.11.3";
import { PageTitle } from '../../components/PageTitle.tsx'

interface PostResult {
  post: PostOptimized;
  ranks: Rank[];
  error?: {
    id: string;
    rank_id: string;
  };
}

export const handler: Handlers<PostResult | Update | null> = {
  async GET(_, ctx) {

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
        Location: `/admin`,
      },
    });
  },
};


export default function PostPage({ data }: PageProps<PostResult | null>) {

  if (!data) {
    return <div>Not Found</div>;
  }
  return (
    <div class="min-h-screen bg-gray-200 dark:bg-gray-800">
      <Head>
        <title>G's Work Admin</title>
      </Head>
      <div
        class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col">
        <header>
          <PageTitle pageTitle="G's Work Admin" link="/admin" />
          {/* <time class="text-gray-500 text-sm" dateTime={data.post.created_at}>
            {dayjs(data.post.created_at).format("YYYY-MM-DD HH:mm:ss")}
          </time> */}
        </header>
        <section class="mt-8">
          <h2 class="text-4xl font-bold text-gray-800 dark:text-gray-400 py-4">
            Details
          </h2>
          <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
            <li class="py-3 sm:py-4">
              <div class="flex items-center space-x-4">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                    ????????????
                  </p>
                </div>
                <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  {data.post.work} {data.post.work_description}
                </div>
              </div>
            </li>
            <li class="py-3 sm:py-4">
              <div class="flex items-center space-x-4">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                    ????????????
                  </p>
                </div>
                <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  {data.post.class}
                </div>
              </div>
            </li>
            <li class="py-3 sm:py-4">
              <div class="flex items-center space-x-4">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                    ????????????
                  </p>
                </div>
                <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  {data.post.student_number}
                </div>
              </div>
            </li>
            <li class="py-3 sm:py-4">
              <div class="flex items-center space-x-4">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                    ??????
                  </p>
                </div>
                <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  {data.post.student}
                </div>
              </div>
            </li>
            <li class="py-3 sm:py-4">
              <div class="flex items-center space-x-4">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                    ????????????
                  </p>
                </div>
                <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  {data.post.work_time}
                </div>
              </div>
            </li>
            <li class="py-3 sm:py-4">
              <div class="flex items-center space-x-4">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                    ???????????????URL
                  </p>
                  <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                    {data.post.work_url}
                  </p>
                </div>
                <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  <a
                    target="_blank"
                    href={data.post.work_url}
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >Link</a>
                </div>
              </div>
            </li>
            <li class="py-3 sm:py-4">
              <div class="flex items-center space-x-4">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                    ??????
                  </p>
                </div>
                <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  {data.post.rank}
                </div>
              </div>
            </li>
          </ul>
        </section>

        <section>
          <form
            class="rounded-xl border dark:border-gray-700 p-5 shadow-md bg-gray-50 dark:bg-gray-800 dark:text-gray-400 mt-8"
            method="POST"
          >
            <div class="flex flex-col gap-y-2">
              <div>
                <label
                  for="rank"
                  class="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Rank
                </label>
                <select
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                <label
                  for="comment"
                  class="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Comment
                </label>
                <textarea
                  id="comment"
                  rows={5}
                  class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  name="comment"
                  value={data.post.comment}
                  placeholder="????????????????????????????????????????????????????????????"
                />
              </div>
            </div>
            <div class="flex justify-end mt-4">
              <a href="/admin">
                <button type="button" class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                  Back
                </button>
              </a>
              <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                Submit
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}