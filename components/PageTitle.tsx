interface PageTitleProps {
  pageTitle: string;
  link: string;
}

export const PageTitle = (props: PageTitleProps) => {
  return (
    <a href={props.link}>
      <h1 class="font-extrabold text-2xl text-gray-800 dark:text-gray-400 py-4">
        {props.pageTitle}
      </h1>
    </a>
  )
}