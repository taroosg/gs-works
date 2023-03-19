import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import dayjs from "https://esm.sh/dayjs@1.11.3";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";
import { Show, findFantasticPosts, PostOptimized, findPostsByClassAndWork, getClasses, getWorks } from "@db";
import { PostsMenu } from '../../components/PostsMenu.tsx';
import { PageTitle } from '../../components/PageTitle.tsx';

dayjs.extend(relativeTime);
dayjs.locale("ja");

export const handler: Handlers<Show> = {
  async GET(_, ctx) {
    const [posts, classes, works] = await Promise.all([
      findFantasticPosts(),
      getClasses(),
      getWorks(),
    ]);
    return ctx.render({ posts, classes, works });
  },
  async POST(req, ctx) {
    const formData = await req.formData();
    const class_id = formData.get("class_id")?.toString() ?? '';
    const work_id = formData.get("work_id")?.toString() ?? '';

    const [posts, classes, works] = await Promise.all([
      findFantasticPosts(class_id, work_id) ?? [],
      getClasses(),
      getWorks(),
    ]);

    return ctx.render({ posts, classes, works, class_id, work_id });
  },
};

export default function FantasticPage({ data }: PageProps<Show>) {
  return (
    <div class="min-h-screen bg-gray-200 dark:bg-gray-800">
      <Head>
        <title>Fantastic Posts</title>
      </Head>
      <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col">
        <PageTitle pageTitle="G's Work Posts" link="/" />
        <PostsMenu />
        <section class="mt-8">
          <h2 class="text-4xl font-bold text-gray-800 dark:text-gray-400 py-4">Fantastic Posts</h2>
          <form method="POST">
            <select name="class_id" id="" value={data.class_id ?? ""}>
              <option value="">-</option>
              {
                data.classes?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.class_name}
                  </option>
                ))
              }
            </select>
            <select name="work_id" id="" value={data.work_id ?? ""}>
              <option value="">-</option>
              {
                data.works?.map((w) => (
                  <option key={w.id} value={w.id}>
                    {`${w.work_number} ${w.description}`}
                  </option>
                ))
              }
            </select>
            <button>submit</button>
          </form>
          <div class="overflow-x-auto relative shadow-md">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="py-3 px-6">
                    work
                  </th>
                  <th scope="col" class="py-3 px-6">
                    class
                  </th>
                  <th scope="col" class="py-3 px-6">
                    number
                  </th>
                  <th scope="col" class="py-3 px-6">
                    name
                  </th>
                  <th scope="col" class="py-3 px-6">
                    rank
                  </th>
                  <th scope="col" class="py-3 px-6">
                    url
                  </th>
                  <th scope="col" class="py-3 px-6">
                    time
                  </th>
                  <th scope="col" class="py-3 px-6">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.posts?.map((post: PostOptimized) => (
                  <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {post.work}
                    </th>
                    <td class="py-4 px-6">
                      {post.class}
                    </td>
                    <td class="py-4 px-6">
                      {post.student_number}
                    </td>
                    <td class="py-4 px-6">
                      {post.student}
                    </td>
                    <td class="py-4 px-6">
                      {post.rank}
                    </td>
                    <td class="py-4 px-6">
                      <a
                        href={post.work_url}
                        target="_blank"
                        class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Link
                      </a>
                    </td>
                    <td class="py-4 px-6">
                      {post.work_time}
                    </td>
                    <td class="py-4 px-6 text-right">
                      <a href={`./${post.id}`} class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                        detail
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div >
  );
}