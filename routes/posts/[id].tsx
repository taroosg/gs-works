
import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/src/runtime/head.ts";
import { Handlers } from "$fresh/server.ts";
import { Post, findPostById } from "@db";
import dayjs from "https://esm.sh/dayjs@1.11.3";

export const handler: Handlers<Post | null> = {
  async GET(_, ctx) {
    // パスパラメータを取得
    const { id } = ctx.params;
    // パスパラメータの ID を引数に記事を取得
    const post = await findPostById(id);

    // 記事が取得できなかった場合は null を渡す
    if (!post) {
      return ctx.render(null);
    }

    // 記事が取得できた場合は取得した記事を渡す
    return ctx.render(post);
  },
};

export default function PostPage({ data }: PageProps<Post | null>) {
  // Props.data に null が渡された時には `Not Found` を表示する
  if (!data) {
    return <div>Not Found</div>;
  }

  return (
    <div class="min-h-screen bg-gray-200">
      <Head>
        <title>{data.student}</title>
      </Head>
      <div
        class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col"      >
        <article class="rounded-xl border p-5 shadow-md bg-white">
          <header>
            <h1 class="font-extrabold text-5xl text-gray-800">
              Work Detail
            </h1>
            <time class="text-gray-500 text-sm" dateTime={data.created_at}>
              {dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss")}
            </time>
          </header>
          <section class="mt-6">
            <p>{data.class}</p>
            <p>{data.student_number}</p>
            <p>{data.student}</p>
            <p>{data.work_time}</p>
            <p>{data.work_url}</p>
            <p>{data.rank}</p>
            <p>{data.comment}</p>
          </section>
        </article>
      </div>
    </div>
  );
}