import { Head } from "$fresh/runtime.ts";
import { PostsMenu } from '../components/PostsMenu.tsx'

export default function Home() {
  return (
    <div class="h-screen bg-gray-200 dark:bg-gray-800">
      <Head>
        <title>G's Work Posts</title>
      </Head>
      <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col">
        <h1 class="font-extrabold text-5xl text-gray-800 dark:text-gray-400">G's Work Posts</h1>
        <PostsMenu />
      </div>
    </div >
  );
}