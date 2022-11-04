interface PageTitleProps {
  pageTitle: string;
  link: string;
}

export const PageTitle = (props: PageTitleProps) => {
  return (
    <a href={props.link}>
      <h1 class="font-extrabold text-5xl text-gray-800 dark:text-gray-400">
        {props.pageTitle}
      </h1>
    </a>
  )
}