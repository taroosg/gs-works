import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { PostsMenu } from '../components/PostsMenu.tsx'
import { PageTitle } from '../components/PageTitle.tsx'
import { PageSubTitle } from '../components/PageSubTitle.tsx'

export const handler: Handlers<string> = {
  GET(_, ctx) {
    const readmeString = `# ここにタイトルを入れる\n\n## DEMO\n\n  - デプロイしている場合はURLを記入（任意）\n\n## 紹介と使い方\n\n  - どんなプロダクトなのか，どのように操作するのか\n\n  - を見た人がわかるように書こう！\n\n## 工夫した点\n\n  - めっちゃ書こう\n\n## 苦戦した点\n\n  - 明日の自分への伝言\n\n## 参考にした web サイトなど\n\n  - 後で見返せるように`;
    return ctx.render(readmeString);
  },
};

export default function Home({ data }: PageProps<string>) {
  return (
    <div class="min-h-screen bg-gray-200 dark:bg-gray-800">
      <Head>
        <title>G's Work Posts</title>
      </Head>
      <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pb-20 flex flex-col">
        <PageTitle pageTitle="G's Work Posts" link="/" />
        <PostsMenu />
        <section>
          <PageSubTitle pageSubTitle="Write readme.md!" />
          <label
            for="readme"
            class="block mb-8 text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            プロダクトのフォルダにはreadme.mdファイルを作成し，下記の内容を記述すること！
          </label>
          <textarea
            id="readme"
            rows={25}
            class="block p-4 w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="readme"
            value={data}
            placeholder=""
            readOnly
          />
        </section>
      </div>
    </div>
  );
}