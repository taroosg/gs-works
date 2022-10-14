import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/src/runtime/head.ts";
import { Handlers } from "$fresh/server.ts";
import { Data, createPost, getStudents, getWorks } from "@db";

interface Hoge {
  students: unknown;
  works: unknown;
}

export const handler: Handlers<Data | Hoge> = {
  async GET(req, ctx) {
    const students = await getStudents();
    const works = await getWorks();
    return ctx.render({ students, works });

  },
  async POST(req, ctx) {
    // フォームデータの入力値を取得
    const formData = await req.formData();
    const work_id = formData.get("work_id")?.toString();
    const student_id = formData.get("student_id")?.toString();
    const work_url = formData.get("work_url")?.toString();
    const work_time = formData.get("work_time")?.toString();

    // タイトルまたはコンテンツどちらも未入力の場合はバリデーションエラー
    if (!work_id || !student_id || !work_url || !work_time) {
      const students = await getStudents();
      const works = await getWorks();

      return ctx.render({
        students, works,
        error: {
          work_id: work_id ? "" : "work_id is required",
          student_id: student_id ? "" : "student_id is required",
          work_url: work_url ? "" : "work_url is required",
          work_time: work_time ? "" : "work_time is required",
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

    // データベースに保存
    await createPost(post);

    // トップページにリダイレクト
    return new Response("", {
      status: 303,
      headers: {
        Location: "/",
      },
    });
  },
};

export default function CreatePostPage({
  data,
}: PageProps<Data | Hoge | undefined>) {
  return (
    <div class="min-h-screen bg-gray-200">
      <Head>
        <title>Create Post</title>
      </Head>
      <div
        class=
        "max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col"
      >
        <h1 class="font-extrabold text-5xl text-gray-800">
          Create Post
        </h1>

        <form
          class="rounded-xl border p-5 shadow-md bg-white mt-8"
          method="POST"
        >
          <div class="flex flex-col gap-y-2">
            <div>
              <label class="text-gray-500 text-sm" htmlFor="title">
                課題番号
              </label>
              <select
                class="w-full p-2 border border-gray-300 rounded-md"
                name="work_id" id="work_id"
              >
                {data.works.map((x) =>
                  <option value={x.id}>{x.work_number} {x.description}</option>
                )}
              </select>
              {data?.error?.work_id && (
                <p class="text-red-500 text-sm">{data.error.work_id}</p>
              )}
            </div>
            <div>
              <label class="text-gray-500 text-sm" htmlFor="title">
                氏名
              </label>
              <select
                class="w-full p-2 border border-gray-300 rounded-md"
                name="student_id" id="student_id"
              >
                {data.students.map((x) =>
                  <option value={x.id}>{x.student_number} {x.name}</option>
                )}
              </select>
              {data?.error?.student_id && (
                <p class="text-red-500 text-sm">{data.error.student_id}</p>
              )}
            </div>
            <div>
              <label class="text-gray-500 text-sm" htmlFor="title">
                URL
              </label>
              <input
                id="work_url"
                class="w-full p-2 border border-gray-300 rounded-md"
                type="text"
                name="work_url"
                value={data?.work_url}
              />
              {data?.error?.work_url && (
                <p class="text-red-500 text-sm">{data.error.work_url}</p>
              )}
            </div>
            <div>
              <label class="text-gray-500 text-sm" htmlFor="title">
                作業時間
              </label>
              <input
                id="work_time"
                class="w-full p-2 border border-gray-300 rounded-md"
                type="number"
                name="work_time"
                value={data?.work_time}
              />
              {data?.error?.work_time && (
                <p class="text-red-500 text-sm">{data.error.work_time}</p>
              )}
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
              class=
              "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
              type="submit"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}