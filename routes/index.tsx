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

export default function Home({ data }: PageProps<Post[]>) { // ③
  return (
    <div class="h-screen bg-gray-200">
      <Head>
        <title>G's Work Posts</title>
      </Head>
      <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col">
        <h1 class="font-extrabold text-5xl text-gray-800">G's Work Posts</h1>
        <section class="mt-8">
          <div class="flex justify-between items-center">
            <h2 class="text-4xl font-bold text-gray-800 py-4">Posts</h2>
            <a
              href="/posts/create"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
            >
              Create Post
            </a>
          </div>
          <table>
            <thead>
              <tr>
                <th>work</th>
                <th>class</th>
                <th>number</th>
                <th>name</th>
                <th>rank</th>
                <th>url</th>
                <th>time</th>
                <th>action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((post: Post) => (
                <tr>
                  <td>{post.work}</td>
                  <td>{post.class}</td>
                  <td>{post.student_number}</td>
                  <td>{post.student}</td>
                  <td>{post.rank}</td>
                  <td>
                    <a href={post.work_url} target="_blank">link</a>
                  </td>
                  <td>{post.work_time}</td>
                  <td>
                    <a href={`admin/${post.id}`}>
                      admin
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* <ul>
            {data.map((post: Post) => (
              <li class="bg-white p-6 rounded-lg shadow-lg mb-4" key={post.id}>
                <a href={`posts/${post.id}`}>
                  <h3 class="text-2xl font-bold mb-2 text-gray-800 hover:text-gray-600 hover:text-underline">
                    {post.work_url}
                  </h3>
                  <p>{post.class}</p>
                  <p>{post.work}</p>
                  <p>{post.student}</p>
                  <p>{post.work_time}</p>
                  <time class="text-gray-500 text-sm" dateTime={post.created_at}>
                    {dayjs(post.created_at).fromNow()}
                  </time>
                </a>
              </li>
            ))}
          </ul> */}
        </section>
      </div>
    </div >
  );
}