import { Class, Work } from "../util/db.ts";

interface FormParams {
  class_id: string;
  classes: Class[];
  work_id: string;
  works: Work[]
}

export const IndexForm = ({ class_id, work_id, classes, works }:FormParams) => {
  return (
    <form
      class="mb-4"
      method="POST"
    >
      <div class="flex flex-col gap-y-2">
        <div>
          <label
            for="class_id"
            class="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            クラス指定
          </label>
          <select
            id="class_id"
            name="class_id"
            value={class_id ?? ""}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">-</option>
            {
              classes?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.class_name}
                </option>
              ))
            }
          </select>
        </div>
        <div>
          <label
            for="work_id"
            class="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            課題指定
          </label>
          <select
            id="work_id"
            name="work_id"
            value={work_id ?? ""}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">-</option>
            {
              works?.map((w) => (
                <option key={w.id} value={w.id}>
                  {`${w.work_number} ${w.description}`}
                </option>
              ))
            }
          </select>
        </div>
      </div>
      <div class="flex justify-end mt-4">
        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
          検索
        </button>
      </div>
    </form>
  )
}