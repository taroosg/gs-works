import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import dayjs from "https://esm.sh/dayjs@1.11.3";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";
import { Show, findFantasticPosts, PostOptimized, findPostsByClassAndWork, getClasses, getWorks } from "@db";
import { PostsMenu } from '../../components/PostsMenu.tsx';
import { PageTitle } from '../../components/PageTitle.tsx';
import { PageSubTitle } from '../../components/PageSubTitle.tsx';
import { IndexForm } from "../../components/IndexForm.tsx";
import { PostsTable } from "../../components/PostsTable.tsx";

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
      <div class="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pb-20 flex flex-col">
        <PageTitle pageTitle="G's Work Posts" link="/" />
        <PostsMenu />
        <section>
          <PageSubTitle pageSubTitle="Fantastic Posts" />
          <IndexForm
            class_id={data.class_id ?? ""}
            work_id={data.work_id ?? ""}
            classes={data.classes ?? []}
            works={data.works ?? []}
          />
        </section>
        <section>
          <PostsTable
            posts={data.posts ?? []}
            isAdmin={false}
          />
        </section>
      </div>
    </div >
 );
}