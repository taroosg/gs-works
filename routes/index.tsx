import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import dayjs from "https://esm.sh/dayjs@1.11.3";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";
import { Post, findAllPosts } from "@db";

dayjs.extend(relativeTime);
dayjs.locale("ja");

export const handler: Handlers<Post[]> = {
  async GET(_, ctx) {
    const posts = await findAllPosts();
    return ctx.render(posts);
  },
};

export default function Home({ data }: PageProps<Post[]>) {
  return (
    <div class="h-screen bg-gray-200 dark:bg-gray-800">
      <Head>
        <title>G's Work Posts</title>
      </Head>
      <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col">
        <h1 class="font-extrabold text-5xl text-gray-800 dark:text-gray-400">G's Work Posts</h1>
        <section class="mt-8 flex justify-center">
          <a href="/posts/create" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
            提出する
          </a>
          <p class="ml-4 mr-4 font-medium text-blue-600 dark:text-blue-500">/</p>
          <a href="/posts" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
            一覧を見る
          </a>
        </section>
      </div>
    </div >
  );
}