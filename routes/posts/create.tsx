import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/src/runtime/head.ts";
import { Handlers } from "$fresh/server.ts";
import { Data, createPost, getStudents, getWorks } from "@db";
import { PostsMenu } from '../../components/PostsMenu.tsx'
import { PageTitle } from '../../components/PageTitle.tsx'
import { PageSubTitle } from '../../components/PageSubTitle.tsx'

export const handler: Handlers<Data> = {
  async GET(_, ctx) {
    const students = await getStudents();
    const works = await getWorks();
    return ctx.render({ students, works });
  },
  async POST(req, ctx) {
    const formData = await req.formData();
    const work_id = formData.get("work_id")?.toString();
    const student_id = formData.get("student_id")?.toString();
    const work_url = formData.get("work_url")?.toString();
    const work_time = formData.get("work_time")?.toString();

    const isValidWorkUrl = (url: string) => /^https:\/\/github\.com\/.+/.test(url);

    if (!work_id || !student_id || !work_url || !work_time || !isValidWorkUrl(work_url)) {
      const students = await getStudents();
      const works = await getWorks();

      return ctx.render({
        students, works,
        error: {
          work_id: work_id ? "" : "課題が指定されていません．",
          student_id: student_id ? "" : "氏名が指定されていません．",
          work_url: work_url && isValidWorkUrl(work_url) ? "" : "URLが指定されていないもしくは不正です．",
          work_time: work_time ? "" : "作業時間が入力されていません．",
        },
        work_id,
        student_id,
        work_url,
        work_time,
      });
    }

    const post = {
      work_id,
      student_id,
      work_url,
      work_time,
    };

    await createPost(post);

    return new Response("", {
      status: 303,
      headers: {
        Location: "/posts",
      },
    });
  },
};

export default function CreatePostPage({
  data,
}: PageProps<Data | undefined>) {
  return (
    <div class="min-h-screen bg-gray-200 dark:bg-gray-800">
      <Head>
        <title>Create Post</title>
      </Head>
      <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pb-20 flex flex-col">
        <PageTitle pageTitle="G's Work Posts" link="/" />
        <PostsMenu />
        <section>
          <PageSubTitle pageSubTitle="Create Posts" />
          <form
            class="border dark:border-gray-700 p-4 shadow-md bg-gray-50 dark:bg-gray-800 dark:text-gray-400"
            method="POST"
          >
            <div class="flex flex-col gap-y-2">
              <div>
                <label
                  for="work_id"
                  class="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  課題番号
                </label>
                <select
                  id="work_id"
                  name="work_id"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">-</option>
                  {data?.works?.map((x) =>
                    <option value={x.id}>{x.work_number} {x.description}</option>
                  )}
                </select>
                {data?.error?.work_id && (
                  <p class="text-red-500 text-sm">{data.error.work_id}</p>
                )}
              </div>
              <div>
                <label
                  for="student_id"
                  class="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  氏名
                </label>
                <select
                  id="student_id"
                  name="student_id"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">-</option>
                  {data?.students?.map((x) =>
                    <option value={x.id}>{x.student_number} {x.name}</option>
                  )}
                </select>
                {data?.error?.student_id && (
                  <p class="text-red-500 text-sm">{data.error.student_id}</p>
                )}
              </div>
              <div>
                <label
                  for="work_url"
                  class="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  URL
                </label>
                <input
                  id="work_url"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  type="text"
                  name="work_url"
                  value={data?.work_url}
                  placeholder="https://github.com/..."
                />
                {data?.error?.work_url && (
                  <p class="text-red-500 text-sm">{data.error.work_url}</p>
                )}
              </div>
              <div>
                <label
                  for="work_time"
                  class="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  作業時間（h）
                </label>
                <input
                  id="work_time"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  type="number"
                  name="work_time"
                  min="1"
                  max="168"
                  placeholder="30"
                  value={data?.work_time}
                />
                {data?.error?.work_time && (
                  <p class="text-red-500 text-sm">{data.error.work_time}</p>
                )}
              </div>
            </div>
            <div class="flex justify-end mt-4">
              <a href="/">
                <button type="button" class="py-2 px-4 mr-2 text-sm font-medium text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                  Back
                </button>
              </a>
              <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                Submit
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}