import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/src/runtime/head.ts";
import { Handlers } from "$fresh/server.ts";
import { Post, Update, Rank, findPostById, getRanks, updatePost, PostOptimized } from "@db";
import dayjs from "https://esm.sh/dayjs@1.11.3";
import { PostsMenu } from '../../components/PostsMenu.tsx'
import { PageTitle } from '../../components/PageTitle.tsx'

interface PostResult {
  post: PostOptimized;
  ranks: Rank[];
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
};


export default function PostPage({ data }: PageProps<PostResult | null>) {

  if (!data) {
    return <div>Not Found</div>;
  }
  return (
    <div class="min-h-screen bg-gray-200 dark:bg-gray-800">
      <Head>
        <title>Post Details</title>
      </Head>
      <div
        class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col">
        <header>
          <PageTitle pageTitle="G's Work Posts" link="/" />
        </header>
        <PostsMenu />
        <section class="mt-6">
          <h2 class="text-4xl font-bold text-gray-800 dark:text-gray-400 py-4">
            Details
          </h2>
          <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
            <li class="py-3 sm:py-4">
              <div class="flex items-center space-x-4">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                    課題番号
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
                    クラス名
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
                    受講番号
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
                    氏名
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
                    実装時間
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
                    プロダクトURL
                  </p>
                  <p class="text-sm text-gray-500 break-words dark:text-gray-400">
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
                    評価
                  </p>
                </div>
                <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  {data.post.rank}
                </div>
              </div>
            </li>
            <li class="py-3 sm:py-4">
              <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                コメント（発表推薦作品のみ）
              </p>
              <p class="text-sm font-medium text-gray-900 break-words dark:text-white">
                {data.post.comment}
              </p>
            </li>
          </ul>
          <div class="flex justify-end mt-4">
            <a href="/posts">
              <button type="button" class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                Back
              </button>
            </a>
          </div>

        </section>
      </div>
    </div>
  );
}