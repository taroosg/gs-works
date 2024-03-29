export const PostsMenu = () => {
  return (
    <section class="flex justify-center">
      <a href="/posts/create" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
        提出する
      </a>
      <p class="ml-4 mr-4 font-medium text-blue-600 dark:text-blue-500">/</p>
      <a href="/posts" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
        作品を見る
      </a>
      <p class="ml-4 mr-4 font-medium text-blue-600 dark:text-blue-500">/</p>
      <a href="/posts/fantastic" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
        すごい作品
      </a>
    </section>
  )
}