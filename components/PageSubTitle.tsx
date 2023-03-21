interface PageSubTitleProps {
  pageSubTitle: string;
}

export const PageSubTitle = (props: PageSubTitleProps) => {
  return (
      <h2 class="text-xl font-bold text-gray-800 dark:text-gray-400 py-4">
        {props.pageSubTitle}
      </h2>
  )
}