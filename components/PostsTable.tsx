import { PostOptimized } from "../util/db.ts";

interface TableParams {
  posts: PostOptimized[];
  isAdmin: boolean;
}

export const PostsTable = ({ posts, isAdmin }: TableParams) => {
  return (
    <div class="overflow-x-auto relative shadow-md">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="py-2 px-6">
              work
            </th>
            <th scope="col" class="py-2 px-6">
              class
            </th>
            <th scope="col" class="py-2 px-6">
              number
            </th>
            <th scope="col" class="py-2 px-6">
              name
            </th>
            <th scope="col" class="py-2 px-6">
              rank
            </th>
            <th scope="col" class="py-2 px-6">
              url
            </th>
            <th scope="col" class="py-2 px-6">
              time
            </th>
            <th scope="col" class="py-2 px-6">
              <span class="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {posts?.map((post: PostOptimized) => (
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <th scope="row" class="py-2 px-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {post.work}
              </th>
              <td class="py-2 px-4">
                {post.class}
              </td>
              <td class="py-2 px-4">
                {post.student_number}
              </td>
              <td class="py-2 px-4">
                {post.student}
              </td>
              <td class="py-2 px-4">
                {post.rank}
              </td>
              <td class="py-2 px-4">
                <a
                  href={post.work_url}
                  target="_blank"
                  class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Link
                </a>
              </td>
              <td class="py-2 px-4">
                {post.work_time}
              </td>
              <td class="py-2 px-4 text-right">
                {
                  isAdmin
                    ?
                    <a href={`/admin/${post.id}`} class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                      admin
                    </a>
                    :
                    <a href={`/posts/${post.id}`} class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                      detail
                    </a>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}