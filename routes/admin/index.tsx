import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import dayjs from "https://esm.sh/dayjs@1.11.3";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";
import { Show, findPostsByClassAndWork, getClasses, getWorks } from "@db";
import { PageTitle } from '../../components/PageTitle.tsx'
import { PageSubTitle } from '../../components/PageSubTitle.tsx'
import { IndexForm } from "../../components/IndexForm.tsx";
import { PostsTable } from "../../components/PostsTable.tsx";

dayjs.extend(relativeTime);
dayjs.locale("ja");

export const handler: Handlers<Show> = {
  async GET(_, ctx) {
    const [posts, classes, works] = await Promise.all([
      [],
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
      findPostsByClassAndWork(class_id, work_id) ?? [],
      getClasses(),
      getWorks(),
    ]);

    const is_post = true;

    return ctx.render({ posts, classes, works, class_id, work_id, is_post });
  },
};

export default function Home({ data }: PageProps<Show>) {
  return (
    <div class="min-h-screen bg-gray-200 dark:bg-gray-800">
      <Head>
        <title>G's Work Admin</title>
      </Head>
      <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pb-20 flex flex-col">
        <PageTitle pageTitle="G's Work Admin" link="/admin" />
        <section>
          <PageSubTitle pageSubTitle="課題チェックページ" />
          <IndexForm
            class_id={data.class_id ?? ""}
            work_id={data.work_id ?? ""}
            classes={data.classes ?? []}
            works={data.works ?? []}
          />
        </section>
        <section>
          {
            data.posts && data.posts.length > 0
              ?
              <PostsTable
                posts={data.posts ?? []}
                isAdmin={true}
              />
              :
              data.is_post
                ?
                <p class="block mb-8 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Not found...
                </p>
                : ''
          }
        </section>
      </div>
    </div >
  );
}